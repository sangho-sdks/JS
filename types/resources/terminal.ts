// @/types/resources/terminal.ts

import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type ReaderType = "android" | "firmware" | "virtual";
export type ReaderStatus = "online" | "offline" | "disabled";

export type TerminalSessionStatus =
    | "pending"
    | "payment_method_presented"
    | "processing"
    | "succeeded"
    | "failed"
    | "canceled"
    | "timed_out";

export type TerminalPaymentMethodType = "card" | "mobile_money" | "qr_code";

export type OfflineSyncStatus =
    | "pending"
    | "syncing"
    | "synced"
    | "conflict"
    | "failed";

// ─── Reader ───────────────────────────────────────────────────────────────────

export interface TerminalReader extends Timestamps {
    id: string;     // préfixe "rdr_"
    object: "terminal_reader";
    app: string;
    label: string;
    serial_number: string;
    reader_type: ReaderType;
    location?: string | null;
    status: ReaderStatus;
    reader_token: string;     // token 24h pour le POS
    reader_token_expires: string;     // ISO 8601
    last_seen_at?: string | null;
    metadata: Metadata;
}

export interface CreateReaderPayloads {
    label: string;
    serial_number: string;
    reader_type?: ReaderType;
    location?: string;
    metadata?: Metadata;
}

export interface ReaderCriteria extends ListParams {
    status?: ReaderStatus;
    reader_type?: ReaderType;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface TerminalSession extends Timestamps {
    id: string;     // préfixe "tsess_"
    object: "terminal_session";
    app: string;
    reader_id: string;
    payment_intent_id: string | null;
    amount: number;
    currency: "XAF";
    status: TerminalSessionStatus;
    payment_method_type?: TerminalPaymentMethodType | null;
    failure_reason?: string | null;
    processor_ref?: string | null;
    client_secret: string;    // utilisé par le POS pour s'authentifier
    expires_at: string;
    metadata: Metadata;
}

export interface CreateSessionPayloads {
    reader: string;             // ID rdr_xxx
    amount: number;
    description?: string;
    category?: string;
    metadata?: Metadata;
}

export interface PresentPaymentPayloads {
    payment_method_type: TerminalPaymentMethodType;
    nonce: string;      // nonce EMV/NFC retourné par le constructeur
}

export interface SessionStatus {
    id: string;
    status: TerminalSessionStatus;
    payment_intent_status: string | null;
    failure_reason: string | null;
}

export interface SessionCriteria extends ListParams {
    status?: TerminalSessionStatus;
    reader?: string;
}

// ─── Offline ──────────────────────────────────────────────────────────────────

export interface OfflineTransactionPayload {
    local_id: string;      // ID unique généré par le POS
    amount: number;
    payment_method_type: TerminalPaymentMethodType;
    card_token?: string;      // token constructeur (PAS le PAN brut)
    captured_at: string;      // ISO 8601 — heure réelle de capture
    reader_id?: string;
    metadata?: Metadata;
}

export interface SyncPayloads {
    transactions: OfflineTransactionPayload[];
}

export interface SyncResult {
    local_id: string;
    sync_status: OfflineSyncStatus;
    payment_intent?: string | null;
    error?: string;
}

export interface SyncResponse {
    synced: number;
    results: SyncResult[];
}

export interface OfflineTransaction extends Timestamps {
    id: string;     // préfixe "offtx_"
    object: "offline_transaction";
    app: string;
    local_id: string;
    amount: number;
    currency: "XAF";
    payment_method_type: TerminalPaymentMethodType;
    captured_at: string;
    sync_status: OfflineSyncStatus;
    synced_at?: string | null;
    payment_intent?: string | null;
    sync_error?: string | null;
    metadata: Metadata;
}