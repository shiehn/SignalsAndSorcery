

import("stdfaust.lib");

import("filter.lib");
import("effect.lib");
/* -*- faust -*- */
/****************************************************************
** helper definitions
*/
bypass(switch, block) = _ <: select2(switch, _, block);
BP(block) = bypass(checkbox("ON"), block);

copysign = ffunction(float copysign(float,float), <math.h>, "");

anti_denormal = pow(10,-20);
//add_dc = +(anti_denormal);
add_dc = +(anti_denormal);
anti_denormal_ac = 1 - 1' : *(anti_denormal) : + ~ *(-1);

smoothi(c) = *(1-c) : +~*(c);

clip(lo,hi) = min(hi) : max(lo);
sym_clip(thr) = clip(-thr,thr);

balance(b) = *(1 - max(0, b)), *(1 - max(0, -b));
wet_dry_mix(w, Fx) = _ <: _, Fx : balance(w) : +;


/****************************************************************
** nonlinear functions
*/

// from thesis of Ragnar Bendiksen (used in swh ladspa valve plugin)

valve = environment {
    ex(x) = (1 - exp(-x));
    nlim = 50; // exp(-nlim)+1 == 1, exp(nlim)/(exp(nlim)+1) == 1

    /* 2 exp() */
    tr(x) = select2(abs(x) > eps, tr_taylor(x), tr_func(max(-600,x))) with
    {
        eps = pow(10,-4);
        tr_func(x) = select2(x < -nlim, x / ex(x), -x*exp(x));
        tr_taylor(x) = 1 + x/2 + x*x/12;
    };

    df(x) = select2(abs(x) > eps, df_taylor(x), df_func(max(-600,x))) with
    {
        eps = pow(10,-4);
        df_func(x) = select2(x < -nlim, 1/ex(x) - (x * exp(-x)) / (ex(x)*ex(x)), -x*exp(x));
        df_taylor(x) = 0.5 + x/6 - x*x*x/180;
    };

    qd(dist, q, x) = dist * (x - q);

    /* 4 exp() because contains 2 valve.tr */
    vt(dist, q, x) = (tr(qd(dist, q, x)) - tr(qd(dist, q, 0))) / dist;

    vt_scaled(dist, q, x) = select2(dist*q > nlim, vt(dist, q, x) / df(qd(dist, q, 0)), vt_lim(dist, q, x)) with
    {
        bigval = pow(10,10);
        f(dist, q, x) = (qd(dist, q, x)/(1 - exp(-qd(dist, q, x)))*exp(dist*q) - dist*q)/(dist*dist*q);
        vt_lim(dist, q, x) = select2(dist*x > nlim, select2(dist*x < -nlim, f(dist, q, x), -1/dist), bigval);
    };
    vts(dist, q, x) = abs(x) : neg : vt_scaled(dist, q) : copysign(_, x);
    vtu(dist, q, g) = vt_scaled(dist, q) : *(g) : neg : vt(dist, q) : neg;
    vtu_(dist, q, g) = vt_scaled(dist, q) :neg :  *(g) : vt_scaled(dist, q) : /(g) : neg;
};

saturate(t, x) = select2(abs(x) < t, x, v)
with {
  sigmoid(x) = x * (1.5 - 0.5 * x * x);
  sat(x) = t + (1 - t)*sigmoid((abs(x)-t)/((1-t)*1.5));
  v = copysign(x, sat(x));
};

nonlin(a,b,c,x) = ((a * x - b * abs(x) * x) - x) * c;
nonlin1 = nonlin(2,1,0.5);


// simple triode circuit emulation

Ftube = ffunction(float Ftube(int,float), "valve.h", "");

TB_12AX7_68k  = fconstant(int TUBE_TABLE_12AX7_68k,  "valve.h");
TB_12AX7_250k = fconstant(int TUBE_TABLE_12AX7_250k, "valve.h");
TB_6V6_68k    = fconstant(int TUBE_TABLE_6V6_68k,    "valve.h");
TB_6V6_250k   = fconstant(int TUBE_TABLE_6V6_250k,   "valve.h");
TB_12AU7_68k  = fconstant(int TUBE_TABLE_12AU7_68k,  "valve.h");
TB_12AU7_250k = fconstant(int TUBE_TABLE_12AU7_250k, "valve.h");
TB_6DJ8_68k   = fconstant(int TUBE_TABLE_6DJ8_68k,   "valve.h");
TB_6DJ8_250k  = fconstant(int TUBE_TABLE_6DJ8_250k,  "valve.h");
TB_12AT7_68k  = fconstant(int TUBE_TABLE_12AT7_68k,  "valve.h");
TB_12AT7_250k = fconstant(int TUBE_TABLE_12AT7_250k, "valve.h");
TB_6C16_68k   = fconstant(int TUBE_TABLE_6C16_68k,   "valve.h");
TB_6C16_250k  = fconstant(int TUBE_TABLE_6C16_250k,  "valve.h");

tubestageF(tb,vplus,divider,fck,Rk,Vk0) = tube : hpf with {
    lpfk = lowpass(1,fck);
    Rp = 100.0e3;
    VkC = Vk0 * (Rp/Rk);
    tube = (+ : -(Vk0) : Ftube(tb) : +(VkC-vplus)) ~ (*(Rk/Rp) : lpfk) : /(divider);
    hpf = highpass(1,31.0);
};

tubestage(tb,fck,Rk,Vk0)  = tubestageF(tb,250.0,40.0,fck,Rk,Vk0);
tubestage130_10(tb,fck,Rk,Vk0) = tubestageF(tb,130.0,10.0,fck,Rk,Vk0);
tubestage130_20(tb,fck,Rk,Vk0) = tubestageF(tb,130.0,20.0,fck,Rk,Vk0);

/****************************************************************
** filter
*/

//---------------------second order Parametric Equalizer---------
// filter(Q,F,G)
//  			Q : quality factor [1..100]
//				F :	frequency (Hz)
//				G : gain [0..1]
//---------------------------------------------------------------
// from "bandfilter.dsp" in the faust2pd distribution 
// which was released under the BSD license.

eqfilter(Q,F,G)	= TF2(  (1 +  K/Q + K*K) 	/ D,
						 2 * (K*K - 1) 		/ D,
						(1 - K/Q + K*K) 	/ D,
						 2 * (K*K - 1) 		/ D,
						(1 - G*K/Q + K*K) 	/ D
					 )
		with {
				K = tan(PI*F/SR);
				D = 1 + G*K/Q + K*K;
		};


ifilter(Q,F,G) = eqfilter(Q,F,1/G);


/****************************************************************
** backward compatible faust library definitions, may removed when
** the good versions in wafscript where updated
*/


//----- Flanging effect renamed in faust-0.9.27 from
//----- flangermono -> flanger_mono
//----- flangerstereo -> flanger_stereo

flangermonoN(dmax,curdel,depth,fb,invert)
  = _ <: _, (-:fdelay(dmax,curdel)) ~ *(fb) : _, 
  *(select2(invert,depth,0-depth)) 
  : + : *(0.5);

flangerstereoN(dmax,curdel1,curdel2,depth,fb,invert)
  =  flangermonoN(dmax,curdel1,depth,fb,invert),
     flangermonoN(dmax,curdel2,depth,fb,invert);

//----- Moog "Voltage Controlled Filter" (VCF)
//----- filter renamed in faust-0.9.27 from
//----- moogvcf -> moog_vcf

import("filter.lib");

moogvcfN(Q,fr)  = (+ : pole(p) : pole(p) 
                   : pole(p) : pole(p) : *(scale(p))) ~ *(mk)
with {
     p = 1.0 - fr * 2.0 * PI / SR; // approx for fr << SR
     scale(p) = pow(1-p,4);
     mk = 0-Q;
};


/****************************************************************
** building blocks
*/
fuzzy_tube(a,b,c,fuzzy) = _ <: _ + nonlin(a,b,c) * fuzzy * 0.5 : sym_clip(0.7);


/****************************************************************
** parameter definitions for use in alternative module
*/

ampctrl = environment {
    drive = vslider(".gxdistortion.drive[alias]",0.35, 0, 1, 0.01);
    wet_dry = vslider(".gxdistortion.wet_dry[alias]",  100, 0, 100, 1) : /(100) : smoothi(0.999);
    preamp =  vslider(".amp2.stage1.Pregain[alias]",-6,-20,20,0.1) : db2linear : smoothi(0.999);
    gain1 = vslider(".amp2.stage2.gain1[alias]", -6, -20.0, 20.0, 0.1) : db2linear : smoothi(0.999);
};

crybaby_ctrl = environment {
    level = vslider(".crybaby.level[alias]", 0.1, 0, 1, 0.01);
    wah = vslider(".crybaby.wah[alias]", 0, 0, 1, 0.01);
    wet_dry = vslider(".crybaby.wet_dry[name:dry/wet][alias]",  100, 0, 100, 1) : /(100);
};

balance_ctrl = environment {
    bal = vslider(".amp.balance[name:Balance][alias]", 0, -1, 1, 0.1) : smoothi(0.999);
};

vibe_lfo_ctrl = environment {
    freq = vslider(".univibe.freq[name:Tempo][tooltip:LFO frequency (Hz)][alias]", 4.4, 0.1, 10, 0.1) * 16;
    phase = vslider(".univibe.stereo[name:St.df][tooltip:LFO phase shift between left and right channels][alias]", 0.11, -0.5, 0.5, 0.01) * 2 * PI;
};

vibe_mono_lfo_ctrl = environment {
    freq = vslider(".univibe_mono.freq[name:Tempo][tooltip:LFO frequency (Hz)][alias]", 4.4, 0.1, 10, 0.1) * 16;
};


declare id "bmpf";
declare name "BigMuffFuzzPedal";
declare shortname "FuzzPedal";
declare category "Distortion";
declare description "BigMuffFuzzPedal";





bigmuff      = _<: filter1,filter2:>_   with {
	tone     = vslider("Tone[style:knob][OWL:PARAMETER_C]",0.5,0,1,0.01);
	filter1  = highpass( 1, 1856):*(tone);
	filter2  = lowpass( 1, 408 ) :*(1-tone);
};

bigmuff2 = _<:*(dry),(*(wet):*(gain):bigmuff:fuzz:fuzzy:fiz):>downfilter with {
    //fuzz(x)      = x-0.15*x^2-0.15*x^3;
    //fuzz(x)      = 1.5*x-0.5*x^3;
    fuzz(x)      = (1+drive/101)*x/(1+drive/101*abs(x));
    drive        = vslider("Drive[style:knob][OWL:PARAMETER_B]", 1, -3, 100, 1);
    fuzzy        = fuzzy_tube(2,1,0.5,drive);
    fiz(x)       = x+(x^7);
    downfilter   = lowpass(1,5631): highpass(1,80);
    gain         = vslider("Input[style:knob][OWL:PARAMETER_A]",0,-24,12,0.1) : db2linear : smoothi(0.999);
    wet          = vslider("Output[style:knob][OWL:PARAMETER_D]",  100, 50, 100, 1) : /(100);
    dry          = 1 - wet;

};
process = ba.bypass_fade(ma.SR/10, checkbox("bypass"), bigmuff2);
