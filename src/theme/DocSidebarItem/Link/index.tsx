import React from "react";
import Link from "@docusaurus/Link";
import { KindIcon } from "../../../components/KindIcon";
import type { Kind } from "../../../components/KindIcon";
import type { PropSidebarItemLink } from "@docusaurus/plugin-content-docs";
import clsx from "clsx";
import styles from "@docusaurus/theme-classic/src/theme/DocSidebarItem/Link/styles.module.css";

interface Props {
    item: PropSidebarItemLink & {
        customProps?: {
            kind?: Kind;
            [key: string]: unknown;
        };
    };
    onItemClick?: (item: PropSidebarItemLink) => void;
    activePath: string;
    level: number;
    index: number;
}

export default function DocSidebarItemLink({ item, onItemClick, activePath }: Props) {
    const { href, label, className, autoAddBaseUrl, customProps } = item;
    const kind = customProps?.kind;
    const isActive = href === activePath;

    return (
        <li
            className={clsx(
                styles.menuExternalLink,
                "menu__list-item",
                className
            )}
        >
            <Link
                className={clsx("menu__link", { "menu__link--active": isActive })}
                autoAddBaseUrl={autoAddBaseUrl}
                aria-current={isActive ? "page" : undefined}
                to={href}
                onClick={onItemClick ? () => onItemClick(item) : undefined}
            >
                {kind ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <KindIcon kind={kind} className="kind-icon" />
                        {label}
                    </span>
                ) : (
                    label
                )}
            </Link>
        </li>
    );
}