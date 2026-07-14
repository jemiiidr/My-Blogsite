"use client";

import { motion } from "motion/react";

export function MotionCard({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			whileHover={{ y: -6 }}
			transition={{ type: "spring", stiffness: 320, damping: 24 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
