"use client";

import React from "react";
import { Button, Input, Link, Divider, Form } from "@heroui/react";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";
import { ArrowLeft, Mail, Eye, EyeOff } from "lucide-react";
import { GoogleIcon, GithubIcon } from "./icons";

export default function CenteredSignUpWithAnimatedForm() {
    const [isFormVisible, setIsFormVisible] = React.useState(false);

    const variants = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 10 },
    };

    const orDivider = (
        <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
        </div>
    );

    return (
        <div className="flex w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <LazyMotion features={domAnimation}>
                    <h1 className="mb-4 text-xl font-medium">Sign Up</h1>
                    <AnimatePresence initial={false} mode="popLayout">
                        {isFormVisible ? (
                            <m.div
                                animate="visible"
                                className="flex flex-col gap-y-3"
                                exit="hidden"
                                initial="hidden"
                                variants={variants}
                            >
                                <Form validationBehavior="native" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
                                    <Input
                                        autoFocus
                                        isRequired
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        variant="bordered"
                                    />
                                    <Input
                                        isRequired
                                        label="Password"
                                        name="password"
                                        type="password"
                                        variant="bordered"
                                    />
                                    <Button color="primary" type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                </Form>
                                {orDivider}
                                <Button
                                    fullWidth
                                    startContent={
                                        <ArrowLeft className="text-default-500" width={18} />
                                    }
                                    variant="flat"
                                    onPress={() => setIsFormVisible(false)}
                                >
                                    Other Sign Up options
                                </Button>
                            </m.div>
                        ) : (
                            <div>
                                <Button
                                    fullWidth
                                    color="primary"
                                    startContent={
                                        <Mail className="pointer-events-none text-2xl" />
                                    }
                                    type="button"
                                    onPress={() => setIsFormVisible(true)}
                                >
                                    Continue with Email
                                </Button>
                                {orDivider}
                                <m.div
                                    animate="visible"
                                    className="flex flex-col gap-y-2"
                                    exit="hidden"
                                    initial="hidden"
                                    variants={variants}
                                >
                                    <Button
                                        fullWidth
                                        startContent={<GoogleIcon width={24} />}
                                        variant="flat"
                                    >
                                        Continue with Google
                                    </Button>
                                    <Button
                                        fullWidth
                                        startContent={<GithubIcon className="text-default-500" width={24} />}
                                        variant="flat"
                                    >
                                        Continue with GitHub
                                    </Button>
                                    <p className="mt-3 text-center text-small">
                                        Already have an account?&nbsp;
                                        <Link href="#" size="sm">
                                            Log In
                                        </Link>
                                    </p>
                                </m.div>
                            </div>
                        )}
                    </AnimatePresence>
                </LazyMotion>
            </div>
        </div>
    );
}
