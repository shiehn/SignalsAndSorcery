;; Author: Steven Yi
<CsoundSynthesizer>
<CsOptions>
-o dac --port=10000
</CsOptions>
<CsInstruments>
sr=48000
ksmps=64
nchnls=2
0dbfs=1

instr 1
    ioct = octcps(p4)
    kpwm = oscili(.1, 5)
    asig = vco2(p5, p4, 4, .5 + kpwm)
    asig += vco2(p5, p4 * 2)

    idepth = 3
    acut = transegr:a(0, .002, 0, idepth, .5, -4.2, 0.001, .5, -4.2, 0)
    asig = zdf_2pole(asig, cpsoct(ioct + acut), 0.5)

    asig *= linsegr:a(1, p3, 1, .5, 0)

    out(asig, asig)

endin

instr Main
    inotes[] fillarray 60, 67, 63, 65, 62
    ioct[] fillarray 0,1,0,0,1
    inote = inotes[p4 % 37 % 11 % 5] + 12 * ioct[p4 % 41 % 17 % 5]
    schedule(1, 0, .25, cpsmidinn(inote), 0.25)

    if(p4 % 64 % 37 % 17 % 11 == 0 && inote != 74 && inote != 62) then
        schedule(1, 0, .5, cpsmidinn(inote + 7), 0.125)
    endif

    schedule(p1, .25, .25, p4 + 1)
endin

schedule("Main", 0, 0, 0)

</CsInstruments>
</CsoundSynthesizer>