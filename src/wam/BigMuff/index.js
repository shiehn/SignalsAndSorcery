/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */

import fetchModule from './fetchModule.js';
import createElement from './Gui/index.js';
import {CompositeAudioNode} from "@webaudiomodules/sdk-parammgr";
import {WebAudioModule} from "@webaudiomodules/sdk";

/**
 * @typedef {import('../sdk-parammgr').ParamMgrNode} ParamMgrNode
 */

class BigMuffNode extends CompositeAudioNode {
	/**
	 * @type {ParamMgrNode}
	 */
	_wamNode;

	/**
	 * @param {AudioWorkletNode} output
	 * @param {ParamMgrNode} paramMgr
	 */
	setup(output, paramMgr) {
		this.connect(output, 0, 0);
		paramMgr.addEventListener('wam-midi', (e) => output.midiMessage(e.detail.data.bytes));
		this._wamNode = paramMgr;
		this._output = output;
	}

	destroy() {
		super.destroy();
		if (this._output) this._output.destroy();
	}

	/**
	 * @param {string} name
	 */
	getParamValue(name) {
		return this._wamNode.getParamValue(name);
	}

	/**
	 * @param {string} name
	 * @param {number} value
	 */
	setParamValue(name, value) {
		return this._wamNode.setParamValue(name, value);
	}
}

/**
 * @param {URL} relativeURL
 * @returns {string}
 */
const getBasetUrl = (relativeURL) => {
	const baseURL = relativeURL.href.substring(0, relativeURL.href.lastIndexOf('/'));
	return baseURL;
};

export default class BigMuffPlugin extends WebAudioModule {
	/**
	 * Faust generated WebAudio AudioWorkletNode Constructor
	 */
	_PluginFactory;

	_baseURL = getBasetUrl(new URL('.', import.meta.url));

	_descriptorUrl = `${this._baseURL}/descriptor.json`;

	async _loadDescriptor() {
		// const url = this._descriptorUrl;
		// if (!url) throw new TypeError('Descriptor not found');
		// const response = await fetch(url);
		const descriptor = {
			"name": "Faust BigMuff",
			"vendor": "Michel Buffa",
			"description": "",
			"version": "1.0.0",
			"apiVersion": "2.0.0",
			"thumbnail": "screenshot.png",
			"keywords": ["faust"],
			"isInstrument": false,
			"website": ""
		}
		Object.assign(this.descriptor, descriptor);
	}

	async initialize(state) {
		await this._loadDescriptor();
		//const imported = await fetchModule('./Node.js');
		const imported = await fetchModule('/static/wam/BigMuff.js');
		this._PluginFactory = imported[Object.keys(imported)[0]];
		return super.initialize(state);
	}

	async createAudioNode(initialState) {
		const factory = new this._PluginFactory(this.audioContext, this._baseURL);
		const faustNode = await factory.load();
		const paramMgrNode = await ParamMgrFactory.create(this, { internalParamsConfig: Object.fromEntries(faustNode.parameters) });
		const node = new BigMuffNode(this.audioContext);
		node.setup(faustNode, paramMgrNode);
		if (initialState) node.setState(initialState);
		return node;
	}

	createGui() {
		return createElement(this);
	}
}
