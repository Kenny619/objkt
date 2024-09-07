type JsonVal = string | number | boolean | null | JsonObj | JsonArr;
interface JsonObj {
	[key: string]: JsonVal;
}
interface JsonArr extends Array<JsonVal> {}
type fnBool = (obj: { key: string; val: JsonVal }) => boolean;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type fnAny = (obj: any) => any;

const isObject = (obj: JsonObj): boolean => typeof obj === "object" && obj !== null && !Array.isArray(obj);

const filter = (obj: JsonObj, fn: fnBool): JsonObj => {
	const filtered: JsonObj = {};
	for (const key in obj) {
		if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
			filtered[key] = filter(obj[key] as JsonObj, fn);
		} else if (fn({ key, val: obj[key] })) {
			filtered[key] = obj[key];
		}
	}
	return filtered;
};

const flat = (obj: JsonObj, mode: "first" | "last" | "all" = "first"): JsonObj => {
	const flattened: JsonObj = {};
	const recFlat = (obj: JsonObj) => {
		for (const key in obj) {
			if (isObject(obj[key] as JsonObj)) {
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
	recFlat(obj);
	return flattened;
};

const map = (fn: fnAny, obj: JsonObj): JsonObj => {
	const mapped: JsonObj = {};
	for (const key in obj) {
		if (isObject(obj[key] as JsonObj)) {
			mapped[key] = map(fn, obj[key] as JsonObj);
		} else {
			mapped[key] = fn(obj[key]);
		}
	}
	return mapped;
};

const toFlat: JsonObj = {
	a: 1,
	b: 2,
	c: 3,
	d: {
		a: 4,
		b: 5,
		g: {
			h: 6,
			i: 7,
		},
	},
	j: null,
	k: {
		l: [9, 10, 11],
		m: {
			c: 12,
			d: 13,
		},
	},
};

const obj: JsonObj = {
	a: 1,
	b: 2,
	c: 3,
	d: {
		e: 4,
		f: 5,
		g: {
			h: 6,
			i: 7,
		},
	},
	j: null,
	k: {
		l: [9, 10, 11],
		m: {
			n: 12,
			o: 13,
		},
		p: 14,
		q: {
			r: 15,
			s: 16,
		},
		t: null,
	},
	u: null,
};

const fn = ({ key, val }: { key: string; val: JsonVal }) => typeof val === "number" && val % 2 === 0;
const mapFn = (val: number) => (typeof val === "number" ? val * 2 : val);
//console.log(filter(obj, fn));
console.log(map(mapFn, obj));
//console.log(flat(toFlat, "all"));
//console.log(obj);
