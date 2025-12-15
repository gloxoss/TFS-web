"use client";

import React from "react";
import { RadioGroup, Radio } from "@heroui/react";

import BasicNavigationHeader from "@/components/application/navigation-headers/basic-navigation-header";
import NavigationHeaderWithBrandColors from "@/components/application/navigation-headers/navigation-header-with-brand-colors";
import NavigationHeaderWithHeadingCTA from "@/components/application/navigation-headers/navigation-header-with-heading-cta";
import NavigationHeaderWithSearchInput from "@/components/application/navigation-headers/navigation-header-with-search-input";
import NavigationHeaderWithTabs from "@/components/application/navigation-headers/navigation-header-with-tabs";

export default function NavigationHeadersPlayground() {
    const [selected, setSelected] = React.useState("basic");

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-xl font-bold">Navigation Headers Playground</h1>
            <RadioGroup
                label="Select Header Variant"
                orientation="horizontal"
                value={selected}
                onValueChange={setSelected}
            >
                <Radio value="basic">Basic</Radio>
                <Radio value="brand-colors">Brand Colors</Radio>
                <Radio value="heading-cta">Heading CTA</Radio>
                <Radio value="search-input">Search Input</Radio>
                <Radio value="tabs">Tabs</Radio>
            </RadioGroup>

            <div className="border border-default-200 rounded-lg overflow-hidden min-h-[400px]">
                {selected === "basic" && <BasicNavigationHeader />}
                {selected === "brand-colors" && <NavigationHeaderWithBrandColors />}
                {selected === "heading-cta" && <NavigationHeaderWithHeadingCTA />}
                {selected === "search-input" && <NavigationHeaderWithSearchInput />}
                {selected === "tabs" && <NavigationHeaderWithTabs />}
            </div>
        </div>
    );
}
