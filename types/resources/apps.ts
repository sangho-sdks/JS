// =============================================================================
// sangho-sdk-js — Type App
// =============================================================================
import type { ForeignKey, Timestamps } from "@/types/common";

export type AppMode = "test" | "prod";
export type AppEnvironment = "sandbox" | "live";

export interface AppCriteria {
  is_active?: boolean;
  name?: string;
  environment?: AppEnvironment;
  mode?: AppMode;
  [key: string]: string | number | boolean;
}

export interface AppKey {
  id: string;
  value: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface AppKeys {
  pk: AppKey;
  sk: AppKey;
}

export interface App extends Timestamps {
  id: string;
  object: "app";
  name: string;
  description?: string | null;
  logo?: string | null;
  mode: AppMode;
  environment: AppEnvironment;
  currency: string;
  is_active: boolean;
  is_verified: boolean;
  allowed_hosts: string[];
  allowed_ips: string[];
  company?: ForeignKey;
}

export interface Payloads {
  name?: string;
  description?: string;
  logo?: File | string;
  allowed_hosts?: string[];
  allowed_ips?: string[];
  is_active?: boolean;
}