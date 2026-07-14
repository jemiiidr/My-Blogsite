import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			{children}
		</svg>
	);
}

export const SunIcon = (props: IconProps) => (
	<IconBase {...props}>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
	</IconBase>
);
export const MoonIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
	</IconBase>
);
export const SearchIcon = (props: IconProps) => (
	<IconBase {...props}>
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" />
	</IconBase>
);
export const ArrowRightIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M5 12h14M13 6l6 6-6 6" />
	</IconBase>
);
export const HeartIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
	</IconBase>
);
export const EyeIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
		<circle cx="12" cy="12" r="2.5" />
	</IconBase>
);
export const MessageIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
	</IconBase>
);
export const ShareIcon = (props: IconProps) => (
	<IconBase {...props}>
		<circle cx="18" cy="5" r="3" />
		<circle cx="6" cy="12" r="3" />
		<circle cx="18" cy="19" r="3" />
		<path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2" />
	</IconBase>
);
export const PenIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="m12 20 9-9-4-4-9 9-2 6 6-2Z" />
		<path d="m15 8 4 4" />
	</IconBase>
);
export const ChartIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
	</IconBase>
);
export const UsersIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
	</IconBase>
);
export const LogOutIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" />
	</IconBase>
);
export const MenuIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M4 6h16M4 12h16M4 18h16" />
	</IconBase>
);
export const XIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="m6 6 12 12M18 6 6 18" />
	</IconBase>
);
export const ClockIcon = (props: IconProps) => (
	<IconBase {...props}>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 7v5l3 2" />
	</IconBase>
);
export const CheckIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="m5 12 4 4L19 6" />
	</IconBase>
);
export const ImageIcon = (props: IconProps) => (
	<IconBase {...props}>
		<rect x="3" y="3" width="18" height="18" rx="2" />
		<circle cx="8.5" cy="8.5" r="1.5" />
		<path d="m21 15-5-5L5 21" />
	</IconBase>
);
export const LinkIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
		<path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
	</IconBase>
);
export const ChevronDownIcon = (props: IconProps) => (
	<IconBase {...props}>
		<path d="m6 9 6 6 6-6" />
	</IconBase>
);
