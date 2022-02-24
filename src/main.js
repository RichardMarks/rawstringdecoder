const INVALID_RAW_RESULT = "The result string is not a raw string";

function parseHex(hexByteValue) {
  const value = parseInt(hexByteValue, 16);
  if (isNaN(value)) {
    return 0;
  }
  return value;
}

function hexByte(value) {
  const str = value.toString(16);
  return str.length === 1 ? `0${str}` : str;
}

function characterToHexByte(character) {
  const code = character.charCodeAt(0);
  if (isNaN(code)) {
    return hexByte(0);
  }
  return hexByte(code);
}

function hexByteToCharacter(hexByteValue) {
  const code = parseHex(hexByteValue);
  return String.fromCharCode(code);
}

function isRawString(raw) {
  if (/^[0-9a-f]+$/g.test(raw)) {
    return true;
  }
  return false;
}

function catchError(err) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}

function toRawString(value) {
  try {
    let stringified = value;
    if (typeof value !== "string") {
      stringified = JSON.stringify(value);
    }
    const characters = stringified.split("");
    const hexBytes = characters.map(characterToHexByte);
    const rawString = hexBytes.join("");
    return rawString;
  } catch (err) {
    catchError(err);
    return "";
  }
}

function fromRawString(raw) {
  try {
    if (!isRawString(raw)) {
      return INVALID_RAW_RESULT;
    }
    const result = parseRaw(raw);
    return result;
  } catch (err) {
    catchError(err);
    return INVALID_RAW_RESULT;
  }
}

function rawToString(raw) {
  if (!isRawString(raw)) {
    return "";
  }

  const hexPairs = raw.match(/.{1,2}/g);

  if (hexPairs === null) {
    return "";
  }

  const bytesToChars = hexPairs.map(hexByteToCharacter);
  const str = bytesToChars.join("");

  return str;
}

function jsonString(str) {
  try {
    const result = JSON.parse(str);
    return result;
  } catch (err) {
    return null;
  }
}

function parseRaw(raw) {
  const str = rawToString(raw);
  const json = jsonString(str);
  if (json !== null) {
    return json;
  }
  return str;
}
function decode(text) {
  return fromRawString(text);
}

async function boot() {
  const btn = document.querySelector(".btn");
  const text = document.querySelector(".text");
  const out = document.querySelector(".out");

  btn.addEventListener(
    "click",
    () => {
      const decoded = decode(text.value);

      const COOKIE_SEPARATION_CHARACTER = String.fromCharCode(230);

      const split =
        typeof decoded.split === "function"
          ? decoded.split(COOKIE_SEPARATION_CHARACTER)
          : null;

      out.innerText = JSON.stringify(
        split ? split.map((raw) => fromRawString(raw)) : decoded,
        null,
        2
      );
    },
    false
  );
}

document.addEventListener("DOMContentLoaded", boot, false);
