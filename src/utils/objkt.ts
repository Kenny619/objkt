type JsonVal = string | number | boolean | null | JsonObj | JsonArr;
interface JsonObj {
	[key: string]: JsonVal;
}
interface JsonArr extends Array<JsonVal> {}
type fnBool = (obj: { key: string; val: JsonVal }) => boolean;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type fnAny = (obj: any) => any;
export class Objkt {
	private readonly objkt: JsonObj;
	constructor(objkt: JsonObj) {
		this.objkt = objkt;
	}

	isObject(obj: JsonVal): boolean {
		return typeof obj === "object" && obj !== null && !Array.isArray(obj);
	}

	allKeys(): string[] {
		const keys: string[] = [];
		const recGetKeys = (obj: JsonObj) => {
			for (const key in obj) {
				keys.push(key);
				if (this.isObject(obj[key])) recGetKeys(obj[key] as JsonObj);
			}
		};
		recGetKeys(this.objkt);
		return keys;
	}

	allValues(): JsonVal[] {
		const val: JsonVal[] = [];
		const recGetValues = (obj: JsonObj) => {
			for (const key in obj) {
				val.push(obj[key]);
				if (this.isObject(obj[key])) recGetValues(obj[key] as JsonObj);
			}
		};
		recGetValues(this.objkt);
		return val;
	}

	flat(mode: "first" | "last" | "all" = "first"): JsonObj {
		const flattened: JsonObj = {};

		const recFlat = (obj: JsonObj) => {
			for (const key in obj) {
				if (this.isObject(obj[key] as JsonObj)) {
					recFlat(obj[key] as JsonObj);
				} else {
					if (key in flattened) {
						if (mode === "first") continue;
						if (mode === "last") flattened[key] = obj[key];
						if (mode === "all" && !Array.isArray(flattened[key])) flattened[key] = [flattened[key], obj[key]];
						else if (mode === "all" && Array.isArray(flattened[key])) flattened[key].push(obj[key]);
					} else flattened[key] = obj[key];
				}
			}
		};
		recFlat(this.objkt);
		return flattened;
	}

	filter(fn: fnBool, obj: JsonObj = this.objkt): JsonObj {
		const filtered: JsonObj = {};
		for (const key in this.objkt) {
			if (this.isObject(this.objkt[key])) {
				filtered[key] = this.filter(fn, this.objkt[key] as JsonObj);
			} else if (fn({ key, val: this.objkt[key] })) {
				filtered[key] = this.objkt[key];
			}
		}
		return filtered;
	}

	map(fn: fnAny, obj: JsonObj = this.objkt): JsonObj {
		const mapped: JsonObj = {};
		for (const key in obj) {
			if (this.isObject(obj[key])) {
				mapped[key] = this.map(fn, obj[key] as JsonObj);
			} else if (fn({ key, val: obj[key] })) {
				mapped[key] = fn({ key, val: obj[key] });
			}
		}
		return mapped;
	}

	reduce(fn: (acc: any, obj: any) => any, initialValue: any): any {
		return this.flatten().reduce(fn, initialValue);
	}
	sort(key: string): any[] {
		return this.flatten().sort((a, b) => a[key] - b[key]);
	}

	merge(obj: any): any {
		return { ...this.objkt, ...obj };
	}
	clone(): JsonObj {
		return JSON.parse(JSON.stringify(this.objkt));
	}
	hasKey(key: string): boolean {
		const keys = this.allKeys();
		return keys.includes(key);
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	hasValue(value: any): boolean {
		const values = this.allValues();
		return values.includes(value);
	}

	every(fn: fnBool): boolean {
		if (this.isObject(this.objkt)) return this.flat().every(fn);
	}

	some(fn: fnBool): boolean {
		if (this.isObject(this.objkt)) return this.flat(this.objkt).some(fn);
		return this.objkt.some(fn);
	}

	find(fn: (obj: any) => boolean): any {
		return this.flatten().find(fn);
	}

	findKey(fn: (obj: any) => boolean): string {
		return this.flatten().findKey(fn);
	}

	findValue(fn: (obj: any) => boolean): any {
		return this.flatten().findValue(fn);
	}
}
