const ALLOWED_TAGS = new Set([
	"p",
	"br",
	"strong",
	"b",
	"em",
	"i",
	"u",
	"s",
	"h2",
	"h3",
	"blockquote",
	"ul",
	"ol",
	"li",
	"a",
	"code",
	"pre",
	"hr",
]);

function sanitizeAnchorAttributes(attributes: string) {
	const hrefMatch = attributes.match(/href\s*=\s*["']([^"']+)["']/i);
	if (!hrefMatch) return "";

	const href = hrefMatch[1].trim();
	if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href)) return "";

	const escapedHref = href
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");

	return ` href="${escapedHref}" target="_blank" rel="noopener noreferrer"`;
}

export function sanitizeRichText(input: string) {
	const withoutDangerousBlocks = input
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(
			/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi,
			"",
		)
		.replace(/<(script|style|iframe|object|embed|form)[^>]*\/?\s*>/gi, "");

	return withoutDangerousBlocks.replace(
		/<\/?([a-zA-Z0-9]+)([^>]*)>/g,
		(fullTag, rawTagName: string, rawAttributes: string) => {
			const tagName = rawTagName.toLowerCase();
			if (!ALLOWED_TAGS.has(tagName)) return "";

			const isClosing = fullTag.startsWith("</");
			if (isClosing) return `</${tagName}>`;
			if (tagName === "br" || tagName === "hr") return `<${tagName}>`;
			if (tagName === "a")
				return `<a${sanitizeAnchorAttributes(rawAttributes)}>`;
			return `<${tagName}>`;
		},
	);
}
