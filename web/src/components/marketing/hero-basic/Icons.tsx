
import React from "react";

export type IconSvgProps = React.SVGProps<SVGSVGElement> & {
    size?: number;
};

export const AcmeIcon: React.FC<IconSvgProps> = ({ size = 32, width, height, ...props }) => (
    <svg fill="none" height={size || height} viewBox="0 0 32 32" width={size || width} {...props}>
        <path
            clipRule="evenodd"
            d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
);
// ... Reuse other icons if needed, but for now only AcmeIcon is used in BasicNavbar according to my read.
// I will include the others just in case they are needed later or for completeness of the "social" file.

const OpenCollectiveIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            fill="none"
            height={size || height}
            viewBox="0 0 24 24"
            width={size || width}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#a)" clipRule="evenodd" fill="currentColor" fillRule="evenodd">
                <path d="M21.865 5.166A11.945 11.945 0 0 1 24 12.001c0 2.54-.789 4.895-2.135 6.834l-3.109-3.109A7.679 7.679 0 0 0 19.714 12a7.679 7.679 0 0 0-.958-3.725l3.109-3.109Z" />
                <path d="m18.834 2.135-3.108 3.109a7.714 7.714 0 1 0 0 13.513l3.108 3.108A11.946 11.946 0 0 1 12 24C5.373 24 0 18.627 0 12S5.373 0 12 0c2.54 0 4.895.789 6.834 2.135Z" />
            </g>
            <defs>
                <clipPath id="a">
                    <path d="M0 0h24v24H0z" fill="#fff" />
                </clipPath>
            </defs>
        </svg>
    );
};
