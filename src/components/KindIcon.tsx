import type { ComponentType, SVGProps } from "react";

import {
    Computer as ClassIcon,
    Link as InterfaceIcon,
    Box as StructIcon,
    List as EnumIcon,
    Database as RecordIcon,
    ArrowRight as DelegateIcon,
} from "lucide-react";

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type Kind =
    | "class"
    | "interface"
    | "struct"
    | "enum"
    | "record"
    | "delegate";

const KindIconMap = {
    class: ClassIcon,
    interface: InterfaceIcon,
    struct: StructIcon,
    enum: EnumIcon,
    record: RecordIcon,
    delegate: DelegateIcon,
};

interface KindIconProps {
    kind: Kind;
    width?: number;
    height?: number;
    className?: string;
}

const iconMap = {
    "📄": "class",
    "🔷": "class",
    "🟠": "struct",
    "🟢": "interface",
    "🟣": "enum",
    "🔵": "record",
    "⚙️": "delegate"
} as const;

type IconKey = keyof typeof iconMap;

function transform(content: string): string {
    return content.replace(
        /^([\u{1F300}-\u{1FAFF}⚙️📄🔷🟠🟢🟣🔵])\s+(.+)$/gu,
        (
            _: string,
            icon: string,
            name: string
        ): string => {
            const kind = iconMap[icon as keyof typeof iconMap];

            if (!kind) return `${icon} ${name}`;

            return `<KindIcon kind="${kind}" /> ${name}`;
        }
    );
}

export function KindIcon({ kind, width = 20, height = 20, className }: KindIconProps) {
    const Icon = KindIconMap[kind];
    return (
        <Icon
            width={width}
            height={height}
            className={className}
            style={{ verticalAlign: "middle", display: "inline-block" }}
        />
    );
}