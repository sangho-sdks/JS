// =============================================================================
// sangho-sdk-js — Core Errors
// Hiérarchie complète d'erreurs, calquée sur l'API DRF Sangho
// =============================================================================

export type SanghoErrorCode =
  | "authentication_error"
  | "permission_error"
  | "not_found"
  | "validation_error"
  | "rate_limit_error"
  | "idempotency_error"
  | "api_error"
  | "network_error"
  | "timeout_error"
  | "public_key_not_allowed";

export interface SanghoErrorResponse {
  message: string;
  type?: string;
  code?: string;
  detail?: string | Record<string, string[]>;
  errors?: Record<string, string[]>;
  status?: number;
  param?: string;
}

/**
 * Classe de base — toutes les erreurs Sangho en héritent.
 */
export class SanghoError extends Error {
  readonly code: SanghoErrorCode;
  readonly statusCode?: number;
  readonly raw?: SanghoErrorResponse;

  constructor(
    message: string,
    code: SanghoErrorCode = "api_error",
    statusCode?: number,
    raw?: SanghoErrorResponse
  ) {
    super(message);
    this.name = "SanghoError";
    this.code = code;
    this.statusCode = statusCode;
    this.raw = raw;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// @/core/errors.ts

/**
 * 401 — Clé API invalide, expirée ou absente.
 */
export class SanghoAuthError extends SanghoError {
  constructor(
    message = "Invalid or missing API key.",
    raw?: SanghoErrorResponse
  ) {
    super(message, "authentication_error", 401, raw);
    this.name = "SanghoAuthError";
  }
}

/**
 * 403 — Clé publique utilisée pour une opération réservée aux clés secrètes.
 */
export class SanghoPublicKeyError extends SanghoError {
  constructor(message = "Public key not allowed for this operation.", raw?: SanghoErrorResponse) {
    super(
      message,
      "public_key_not_allowed",
      403,
      raw  // ← raw transmis
    );
    this.name = "SanghoPublicKeyError";
  }
}

/**
 * 403 — Permissions insuffisantes.
 */
export class SanghoPermissionError extends SanghoError {
  constructor(message = "You do not have permission to perform this action.", raw?: SanghoErrorResponse) {
    super(message, "permission_error", 403, raw);  // ← raw transmis
    this.name = "SanghoPermissionError";
  }
}

/**
 * 404 — Ressource introuvable.
 */
export class SanghoNotFoundError extends SanghoError {
  constructor(resource: string, id: string) {
    super(`No such ${resource}: '${id}'`, "not_found", 404);
    this.name = "SanghoNotFoundError";
  }
}

/**
 * 422 — Données invalides (erreurs de validation champ par champ).
 */
export class SanghoValidationError extends SanghoError {
  readonly fieldErrors: Record<string, string[]>;
  readonly param?: string;

  constructor(raw: SanghoErrorResponse) {
    const fields =
      typeof raw.detail === "object"
        ? raw.detail
        : (raw.errors ?? {});
    const summary = Object.entries(fields)
      .map(([k, v]) => `${k}: ${v.join(", ")}`)
      .join(" | ");
    super(summary || raw.message || "Validation error", "validation_error", 422, raw);
    this.name = "SanghoValidationError";
    this.fieldErrors = fields as Record<string, string[]>;
  }
}

/**
 * 429 — Trop de requêtes. `retryAfter` indique le délai (secondes) avant retry.
 */
export class SanghoRateLimitError extends SanghoError {
  readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    super(
      `Rate limit exceeded.${retryAfter ? ` Retry after ${retryAfter}s.` : ""}`,
      "rate_limit_error",
      429
    );
    this.name = "SanghoRateLimitError";
    this.retryAfter = retryAfter;
  }
}

/**
 * 409 — Clé d'idempotence réutilisée avec un payload différent.
 */
export class SanghoIdempotencyError extends SanghoError {
  constructor() {
    super(
      "Idempotency key reused with different request parameters.",
      "idempotency_error",
      409
    );
    this.name = "SanghoIdempotencyError";
  }
}

/**
 * Erreur réseau (pas de réponse du serveur).
 */
export class SanghoNetworkError extends SanghoError {
  constructor(message = "Network error. Please check your connection.") {
    super(message, "network_error");
    this.name = "SanghoNetworkError";
  }
}

/**
 * Timeout dépassé.
 */
export class SanghoTimeoutError extends SanghoError {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms.`, "timeout_error");
    this.name = "SanghoTimeoutError";
  }
}
