'use client';

import { useParams } from "next/navigation";
import { useTranslation } from 'react-i18next';
import LoginForm from './login-form';

export default function Login() {
  const params = useParams();
  const { t } = useTranslation();
  const lng = params.lng as string;

  return <LoginForm lng={lng} />;
}