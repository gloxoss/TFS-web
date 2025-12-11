"use client";

import React from "react";
import { Button, Input, Link, Divider, Form } from "@heroui/react";
import { AnimatePresence, m, domAnimation, LazyMotion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { GoogleIcon, GithubIcon } from "./icons";

export default function CenteredLoginWithAnimatedForm() {
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log("handleSubmit");
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <div className="overflow-hidden">
                    {/* Using a div for sizing instead of ResizablePanel if not available, or standard layout */}
                    <h1 className="mb-4 text-xl font-medium">Log In</h1>
                    <AnimatePresence initial={false} mode="popLayout">
                        <LazyMotion features={domAnimation}>
                            {isFormVisible ? (
                                <m.div
                                    animate="visible"
                                    className="flex flex-col gap-y-3"
                                    exit="hidden"
                                    initial="hidden"
                                    variants={variants}
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <Form validationBehavior="native" onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                                        <Button className="w-full" color="primary" type="submit">
                                            Log In
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
                                        Other Login options
                                    </Button>
                                </m.div>
                            ) : (
                                <>
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
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                fullWidth
                                                startContent={<GoogleIcon width={24} />}
                                                variant="flat"
                                            >
                                                Continue with Google
                                            </Button>
                                            <Button
                                                fullWidth
                                                startContent={
                                                    <GithubIcon className="text-default-500" width={24} />
                                                }
                                                variant="flat"
                                            >
                                                Continue with Github
                                            </Button>
                                        </div>
                                        <p className="mt-3 text-center text-small">
                                            Need to create an account?&nbsp;
                                            <Link href="#" size="sm">
                                                Sign Up
                                            </Link>
                                        </p>
                                    </m.div>
                                </>
                            )}
                        </LazyMotion>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
