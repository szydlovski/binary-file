import {
	decodeString,
	StringEncoding,
} from './helpers/stringEncoding.js';

export class BinaryFileReader {
	#view: DataView;
	#position = 0;
	#savedPosition: number | undefined;
	constructor(buffer: ArrayBuffer) {
		this.#view = new DataView(buffer);
	}
	private get view() {
		return this.#view;
	}
	private get position() {
		return this.#position;
	}
	public get buffer() {
		return this.view.buffer;
	}
	public get byteLength() {
		return this.buffer.byteLength;
	}
	public at(position: number) {
		const reader = new BinaryFileReader(this.buffer);
		reader.setPosition(position);
		return reader;
	}
	public slice(begin = 0, end = this.buffer.byteLength) {
		return new BinaryFileReader(this.buffer.slice(begin, end));
	}
	private read<T>(performRead: (position: number) => T, byteLength: number): T {
		if (this.position + byteLength > this.view.buffer.byteLength) {
			throw new Error(
				`Reader is out of bounds. Tried to read ${byteLength} bytes at offset ${this.position}, but the buffer is only ${this.view.buffer.byteLength} bytes long`
			);
		}
		const value = performRead(this.position);
		this.movePosition(byteLength);
		return value;
	}
	public readFloat32(littleEndian = false) {
		return this.read(
			(position) => this.view.getFloat32(position, littleEndian),
			4
		);
	}
	public readFloat64(littleEndian = false) {
		return this.read(
			(position) => this.view.getFloat64(position, littleEndian),
			4
		);
	}
	public readBigInt64(littleEndian = false) {
		return this.read(
			(position) => this.view.getBigInt64(position, littleEndian),
			8
		);
	}
	public readBigUInt64(littleEndian = false) {
		return this.read(
			(position) => this.view.getBigUint64(position, littleEndian),
			8
		);
	}
	public readInt32(littleEndian = false) {
		return this.read(
			(position) => this.view.getInt32(position, littleEndian),
			4
		);
	}
	public readUint32(littleEndian = false) {
		return this.read(
			(position) => this.view.getUint32(position, littleEndian),
			4
		);
	}
	public readInt16(littleEndian = false) {
		return this.read(
			(position) => this.view.getInt16(position, littleEndian),
			2
		);
	}
	public readUint16(littleEndian = false) {
		return this.read(
			(position) => this.view.getUint16(position, littleEndian),
			2
		);
	}
	public readInt8() {
		return this.read((position) => this.view.getInt8(position), 1);
	}
	public readUint8() {
		return this.read((position) => this.view.getUint8(position), 1);
	}
	public readString(byteLength: number, encoding: StringEncoding = 'utf8') {
		return decodeString(this.nextBytes(byteLength), encoding);
	}
	public readUint(byteLength: number, littleEndian = false) {
		switch (byteLength) {
			case 1:
				return this.readUint8();
			case 2:
				return this.readUint16(littleEndian);
			case 4:
				return this.readUint32(littleEndian);
			case 8:
				return this.readBigUInt64(littleEndian);
			default:
				throw new Error(`Unknown integer byte length ${byteLength}`);
		}
	}
	public readFloat(byteLength: number, littleEndian = false) {
		switch (byteLength) {
			case 4:
				return this.readFloat32(littleEndian);
			case 8:
				return this.readFloat64(littleEndian);
			default:
				throw new Error(`Unknown float byte length ${byteLength}`);
		}
	}
	public nextBytes(byteLength: number) {
		const bytes = this.view.buffer.slice(
			this.position,
			this.position + byteLength
		);
		this.movePosition(byteLength);
		return bytes;
	}
	public setPosition(position: number) {
		this.#position = position;
	}
	public movePosition(bytes: number) {
		this.#position += bytes;
	}
	public save() {
		if (this.#savedPosition !== undefined) {
			console.warn('There already is a saved position!');
		}
		this.#savedPosition = this.#position;
	}
	public restore() {
		if (this.#savedPosition === undefined) {
			throw new Error(`Position must be saved before it can be restored.`);
		}
		this.#position = this.#savedPosition;
		this.#savedPosition = undefined;
	}
}
