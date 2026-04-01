// =============================================================================
// sangho-sdk-js — Types de domaine
// Couvre tous les modèles exposables via l'API publique Sangho
// =============================================================================
import type {
    AmountInCents,
    Timestamps
} from "@/types/common";

export interface SecurityProfile extends Timestamps {
    id: string;
    app: string;
    /** IPs autorisées — liste vide = toutes autorisées */
    allowed_ips: string[];
    /** Montant max par transaction en centimes */
    max_transaction_amount?: AmountInCents;
    /** Montant max par jour en centimes */
    max_daily_amount?: AmountInCents;
    /** Nombre max de transactions par heure */
    max_hourly_transactions?: number;
    require_cvv: boolean;
    require_3ds: boolean;
    block_vpn: boolean;
    block_tor: boolean;
    allowed_countries: string[]; // codes ISO
}

export interface UpdateSecurityProfileParams {
    allowed_ips?: string[];
    max_transaction_amount?: AmountInCents;
    max_daily_amount?: AmountInCents;
    max_hourly_transactions?: number;
    require_cvv?: boolean;
    require_3ds?: boolean;
    block_vpn?: boolean;
    block_tor?: boolean;
    allowed_countries?: string[];
}
