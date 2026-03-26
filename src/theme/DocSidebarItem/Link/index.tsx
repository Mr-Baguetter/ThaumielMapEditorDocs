import React from "react";
import DocSidebarItemLink from "@theme-original/DocSidebarItem/Link";
import type DocSidebarItemLinkType from "@theme/DocSidebarItem/Link";
import type { WrapperProps } from "@docusaurus/types";
import { KindIcon } from "../../../components/KindIcon";
import type { Kind } from "../../../components/KindIcon";

type Props = WrapperProps<typeof DocSidebarItemLinkType>;

export default function DocSidebarItemLinkWrapper(props: Props) {
    const kind = props.item?.customProps?.kind as Kind | undefined;

    if (!kind) {
        return <DocSidebarItemLink {...props} />;
    }

    return (
        <DocSidebarItemLink
            {...props}
            item={{
                ...props.item,
                label: props.item.label,
            }}
        >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <KindIcon kind={kind} className="kind-icon" />
                {props.item.label}
            </span>
        </DocSidebarItemLink>
    );
}