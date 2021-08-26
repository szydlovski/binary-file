import { swap16 } from "./misc.js";

export type StringEncoding = 'utf8' | 'utf16le' | 'utf16be';

function encodeUtf8(input: string) {
  return new TextEncoder().encode(input).buffer;
}

function decodeUtf8(input: ArrayBuffer) {
  return new TextDecoder().decode(input);
}

function encodeUtf16(input: string, littleEndian = false) {
  const view = new Uint16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    view[i] = littleEndian ? charCode : swap16(charCode);
  }
  return view.buffer;
}

function decodeUtf16(input: ArrayBuffer, littleEndian = false) {
  const view = new Uint16Array(input);
  let result = '';
  for (const value of view) {
    result += String.fromCharCode(littleEndian ? value : swap16(value));
  }
  return result;
}

export function encodeString(input: string, encoding: StringEncoding = 'utf8') {
  switch(encoding) {
    case 'utf16le': return encodeUtf16(input, true);
    case 'utf16be': return encodeUtf16(input, false);
    case 'utf8': return encodeUtf8(input);
    default: throw new Error(`Unknown string encoding "${encoding}"`);
  }
}

export function decodeString(input: ArrayBuffer, encoding: StringEncoding = 'utf8') {
  switch(encoding) {
    case 'utf16le': return decodeUtf16(input, true);
    case 'utf16be': return decodeUtf16(input, false);
    case 'utf8': return decodeUtf8(input);
    default: throw new Error(`Unknown string encoding "${encoding}"`);
  }
}