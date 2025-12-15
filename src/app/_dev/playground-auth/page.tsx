"use client";

import React from "react";
import CenteredLoginWithAnimatedForm from "@/components/application/authentication/CenteredLoginWithAnimatedForm";
import CenteredLoginWithBlurredContainer from "@/components/application/authentication/CenteredLoginWithBlurredContainer";
import CenteredLoginWithGradientBackground from "@/components/application/authentication/CenteredLoginWithGradientBackground";
import CenteredLoginWithOnlyEmail from "@/components/application/authentication/CenteredLoginWithOnlyEmail";
import CenteredLoginWithTopLogo from "@/components/application/authentication/CenteredLoginWithTopLogo";
import CenteredLoginWithTwoSteps from "@/components/application/authentication/CenteredLoginWithTwoSteps";
import CenteredSignUp from "@/components/application/authentication/CenteredSignUp";
import CenteredSignUpWithAnimatedForm from "@/components/application/authentication/CenteredSignUpWithAnimatedForm";
import CenteredSignUpWithBlurredContainer from "@/components/application/authentication/CenteredSignUpWithBlurredContainer";
import CenteredSignUpWithGradientBackground from "@/components/application/authentication/CenteredSignUpWithGradientBackground";
import CenteredSignUpWithOnlyEmail from "@/components/application/authentication/CenteredSignUpWithOnlyEmail";
import CenteredSignUpWithTopLogo from "@/components/application/authentication/CenteredSignUpWithTopLogo";
import CenteredSignUpWithTwoSteps from "@/components/application/authentication/CenteredSignUpWithTwoSteps";
import LeftLoginWithImageBackground from "@/components/application/authentication/LeftLoginWithImageBackground";
import LeftLoginWithRightTestimonial from "@/components/application/authentication/LeftLoginWithRightTestimonial";
import LeftSignUpWithImageBackground from "@/components/application/authentication/LeftSignUpWithImageBackground";
import LeftSignUpWithRightTestimonial from "@/components/application/authentication/LeftSignUpWithRightTestimonial";
import RightLoginWithImageBackground from "@/components/application/authentication/RightLoginWithImageBackground";
import RightSignUpWithImageBackground from "@/components/application/authentication/RightSignUpWithImageBackground";
import SimpleLogin from "@/components/application/authentication/SimpleLogin";
import SimpleLoginWithoutBackground from "@/components/application/authentication/SimpleLoginWithoutBackground";
import SimpleLoginWithoutSocial from "@/components/application/authentication/SimpleLoginWithoutSocial";
import SimpleSignUp from "@/components/application/authentication/SimpleSignUp";
import SimpleSignUpWithoutBackground from "@/components/application/authentication/SimpleSignUpWithoutBackground";
import { RadioGroup, Radio } from "@heroui/react";

export default function AuthPlayground() {
    const [selected, setSelected] = React.useState("animated");

    const renderComponent = () => {
        switch (selected) {
            case "animated":
                return <CenteredLoginWithAnimatedForm />;
            case "blurred":
                return <CenteredLoginWithBlurredContainer />;
            case "gradient":
                return <CenteredLoginWithGradientBackground />;
            case "only-email":
                return <CenteredLoginWithOnlyEmail />;
            case "top-logo":
                return <CenteredLoginWithTopLogo />;
            case "two-steps":
                return <CenteredLoginWithTwoSteps />;
            case "signup-basic":
                return <CenteredSignUp />;
            case "signup-animated":
                return <CenteredSignUpWithAnimatedForm />;
            case "signup-blurred":
                return <CenteredSignUpWithBlurredContainer />;
            case "signup-gradient":
                return <CenteredSignUpWithGradientBackground />;
            case "signup-only-email":
                return <CenteredSignUpWithOnlyEmail />;
            case "signup-top-logo":
                return <CenteredSignUpWithTopLogo />;
            case "signup-two-steps":
                return <CenteredSignUpWithTwoSteps />;
            case "left-login-image":
                return <LeftLoginWithImageBackground />;
            case "left-login-testimonial":
                return <LeftLoginWithRightTestimonial />;
            case "left-signup-image":
                return <LeftSignUpWithImageBackground />;
            case "left-signup-testimonial":
                return <LeftSignUpWithRightTestimonial />;
            case "right-login-image":
                return <RightLoginWithImageBackground />;
            case "right-signup-image":
                return <RightSignUpWithImageBackground />;
            case "simple-login":
                return <SimpleLogin />;
            case "simple-login-transparent":
                return <SimpleLoginWithoutBackground />;
            case "simple-login-no-social":
                return <SimpleLoginWithoutSocial />;
            case "simple-signup":
                return <SimpleSignUp />;
            case "simple-signup-transparent":
                return <SimpleSignUpWithoutBackground />;
            default:
                return <CenteredLoginWithAnimatedForm />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center gap-8 p-8 bg-default-50 dark:bg-black">
            <div className="w-full max-w-4xl flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Authentication Playground</h1>
                <RadioGroup
                    orientation="horizontal"
                    value={selected}
                    onValueChange={setSelected}
                    className="flex-wrap"
                >
                    <div className="flex flex-wrap gap-4">
                        <Radio value="animated">Login Animated</Radio>
                        <Radio value="blurred">Login Blurred</Radio>
                        <Radio value="gradient">Login Gradient</Radio>
                        <Radio value="only-email">Login Email</Radio>
                        <Radio value="top-logo">Login Logo</Radio>
                        <Radio value="two-steps">Login 2-Step</Radio>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <Radio value="signup-basic">Sign Up Basic</Radio>
                        <Radio value="signup-animated">Sign Up Animated</Radio>
                        <Radio value="signup-blurred">Sign Up Blurred</Radio>
                        <Radio value="signup-gradient">Sign Up Gradient</Radio>
                        <Radio value="signup-only-email">Sign Up Email</Radio>
                        <Radio value="signup-top-logo">Sign Up Logo</Radio>
                        <Radio value="signup-two-steps">Sign Up 2-Step</Radio>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <Radio value="left-login-image">Left Login Img</Radio>
                        <Radio value="left-login-testimonial">Left Login Testimonial</Radio>
                        <Radio value="right-login-image">Right Login Img</Radio>
                        <Radio value="left-signup-image">Left Sign Up Img</Radio>
                        <Radio value="left-signup-testimonial">Left Sign Up Testimonial</Radio>
                        <Radio value="right-signup-image">Right Sign Up Img</Radio>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <Radio value="simple-login">Simple Login</Radio>
                        <Radio value="simple-login-transparent">Simple Login Transparent</Radio>
                        <Radio value="simple-login-no-social">Simple Login No/Social</Radio>
                        <Radio value="simple-signup">Simple Sign Up</Radio>
                        <Radio value="simple-signup-transparent">Simple Sign Up Transparent</Radio>
                    </div>
                </RadioGroup>
            </div>

            <div className="w-full max-w-4xl border border-dashed border-default-300 rounded-lg p-8 min-h-[600px] flex items-center justify-center relative overflow-hidden">
                {renderComponent()}
            </div>
        </div>
    );
}
