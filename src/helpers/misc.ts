export function swap64(value: number) {
	return (
		((value & 0xff00000000000000) >> 56) |
		((value & 0x00ff000000000000) >> 40) |
		((value & 0x0000ff0000000000) >> 24) |
		((value & 0x000000ff00000000) >> 8) |
		((value & 0x00000000ff000000) << 8) |
		((value & 0x0000000000ff0000) << 24) |
		((value & 0x000000000000ff00) << 40) |
		((value & 0x00000000000000ff) << 56)
	);
}

export function swap32(value: number) {
	return (
		((value & 0xff000000) >> 24) |
		((value & 0x00ff0000) >> 8) |
		((value & 0x0000ff00) << 8) |
		((value & 0x000000ff) << 24)
	);
}

export function swap16(value: number) {
	return ((value & 0xff00) >> 8) | ((value & 0x00ff) << 8);
}

export function swapBytes(buffer: ArrayBuffer) {
	const swapped = new Uint8Array(new ArrayBuffer(buffer.byteLength));
	const view = new Uint8Array(buffer);
	for (let i = 0; i < view.length; i++) {
		swapped[view.length - 1 - i] = view[i];
	}
	return swapped.buffer;
}

export function concatBuffers(...buffers: ArrayBuffer[]) {
	const result = new Uint8Array(
		buffers.reduce((total, next) => total + next.byteLength, 0)
	);
	let offset = 0;
	for (const buffer of buffers) {
		result.set(new Uint8Array(buffer), offset);
		offset += buffer.byteLength;
	}
	return result.buffer;
}
