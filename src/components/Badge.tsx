import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

type BadgeColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'cyan'
  | 'gray'
  | 'secondary';

interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
  outline?: boolean;
}

const colorMap: Record<BadgeColor, string> = {
  blue: styles.blue,
  green: styles.green,
  orange: styles.orange,
  purple: styles.purple,
  cyan: styles.cyan,
  gray: styles.gray,
  secondary: styles.secondary,
};

export default function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, colorMap[color])}>
      {children}
    </span>
  );
}