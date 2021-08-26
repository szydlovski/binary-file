import { encodeString, StringEncoding } from "./helpers/stringEncoding.js";
import { concatBuffers } from "./helpers/misc.js";

export class BinaryFileWriter {
	#buffer: ArrayBuffer;
	#view: DataView;
	#pointer = 0;
	public constructor() {
		this.#buffer = new ArrayBuffer(0);
		this.#view = new DataView(this.#buffer);
	}
	public get buffer() {
		return this.#buffer;
	}
	private get view() {
		if (this.#view.buffer !== this.#buffer) {
			this.#view = new DataView(this.#buffer);
		}
		return this.#view;
	}
	private get position() {
		return this.#pointer;
	}
	public movePointer(bytes: number) {
		this.#pointer += bytes;
	}
	public setPointer(position: number) {
		this.#pointer = position;
	}
	private enlarge(bytes: number) {
		this.#buffer = concatBuffers(this.#buffer, new ArrayBuffer(bytes));
	}
  private alloc(bytes: number) {
    if (this.view.byteLength < bytes) {
      this.enlarge(bytes - this.view.byteLength);
    }
  }
	private write(performWrite: () => void, requiredBytes: number) {
    this.alloc(this.position + requiredBytes);
		performWrite();
		this.movePointer(requiredBytes);
	}
	public writeInt8(value: number) {
		this.write(() => this.view.setInt8(this.position, value), 1);
	}
	public writeUint8(value: number) {
		this.write(() => this.view.setUint8(this.position, value), 1);
	}
	public writeInt16(value: number, littleEndian = false) {
		this.write(() => this.view.setInt16(this.position, value, littleEndian), 2);
	}
	public writeUint16(value: number, littleEndian = false) {
		this.write(() => this.view.setUint16(this.position, value, littleEndian), 2);
	}
	public writeInt32(value: number, littleEndian = false) {
		this.write(() => this.view.setInt32(this.position, value, littleEndian), 4);
	}
	public writeUint32(value: number, littleEndian = false) {
		this.write(() => this.view.setUint32(this.position, value, littleEndian), 4);
	}
  public writeString(value: string, encoding: StringEncoding) {
    this.writeBytes(encodeString(value, encoding));
  }
	public writeBytes(buffer: ArrayBuffer) {
		this.write(() => {
      const byteView = new Uint8Array(this.buffer);
      byteView.set(new Uint8Array(buffer), this.position)
    }, buffer.byteLength);
	}
}