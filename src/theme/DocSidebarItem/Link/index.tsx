import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";
import { KindIcon } from "../../../components/KindIcon";
import type { Kind } from "../../../components/KindIcon";
import type { Props } from "@theme/DocSidebarItem/Link";
import styles from "./styles.module.css";

export default function DocSidebarItemLink({item, onItemClick, activePath, level, index, ...props }: Props): React.JSX.Element {
    const { href, label, className, autoAddBaseUrl, customProps } = item;
    const isActive = href === activePath;
    const isInternalLink = isInternalUrl(href);
    const kind = customProps?.kind as Kind | undefined;

    return (
        <li
            className={clsx(
                ThemeClassNames.docs.docSidebarItemLink,
                ThemeClassNames.docs.docSidebarItemLinkLevel(level),
                "menu__list-item",
                className
            )}
            key={label}
        >
            <Link
                className={clsx(
                    "menu__link",
                    !isInternalLink && styles.menuExternalLink,
                    { "menu__link--active": isActive }
                )}
                autoAddBaseUrl={autoAddBaseUrl}
                aria-current={isActive ? "page" : undefined}
                to={href}
                {...(isInternalLink && {
                    onClick: onItemClick ? () => onItemClick(item) : undefined,
                })}
            >
                {kind ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <KindIcon kind={kind} className="kind-icon" />
                        {label}
                    </span>
                ) : (
                    label
                )}
                {!isInternalLink && <IconExternalLink />}
            </Link>
        </li>
    );
}