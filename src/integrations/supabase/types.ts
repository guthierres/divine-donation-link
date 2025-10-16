export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          category: Database["public"]["Enums"]["campaign_category"]
          created_at: string
          current_amount: number
          description: string
          end_date: string | null
          goal_amount: number
          id: string
          image_url: string | null
          parish_id: string
          slug: string
          start_date: string
          status: Database["public"]["Enums"]["campaign_status"]
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["campaign_category"]
          created_at?: string
          current_amount?: number
          description: string
          end_date?: string | null
          goal_amount: number
          id?: string
          image_url?: string | null
          parish_id: string
          slug: string
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["campaign_category"]
          created_at?: string
          current_amount?: number
          description?: string
          end_date?: string | null
          goal_amount?: number
          id?: string
          image_url?: string | null
          parish_id?: string
          slug?: string
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean
          campaign_id: string
          created_at: string
          donor_email: string
          donor_name: string
          donor_phone: string | null
          id: string
          message: string | null
          pagarme_response: Json | null
          parish_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: Database["public"]["Enums"]["donation_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          anonymous?: boolean
          campaign_id: string
          created_at?: string
          donor_email: string
          donor_name: string
          donor_phone?: string | null
          id?: string
          message?: string | null
          pagarme_response?: Json | null
          parish_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["donation_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          anonymous?: boolean
          campaign_id?: string
          created_at?: string
          donor_email?: string
          donor_name?: string
          donor_phone?: string | null
          id?: string
          message?: string | null
          pagarme_response?: Json | null
          parish_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["donation_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          donation_id: string | null
          id: string
          message: string
          parish_id: string
          read: boolean
          title: string
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          id?: string
          message: string
          parish_id: string
          read?: boolean
          title: string
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          id?: string
          message?: string
          parish_id?: string
          read?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      parishes: {
        Row: {
          address: string | null
          city: string
          cnpj: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          email: string
          icon_url: string | null
          id: string
          infinitepay_api_key: string | null
          infinitepay_configured: boolean
          logo_url: string | null
          name: string
          pagarme_configured: boolean
          pagarme_secret_key: string | null
          phone: string | null
          responsible_name: string
          slug: string
          state: string
          status: Database["public"]["Enums"]["parish_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city: string
          cnpj?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email: string
          icon_url?: string | null
          id?: string
          infinitepay_api_key?: string | null
          infinitepay_configured?: boolean
          logo_url?: string | null
          name: string
          pagarme_configured?: boolean
          pagarme_secret_key?: string | null
          phone?: string | null
          responsible_name: string
          slug: string
          state: string
          status?: Database["public"]["Enums"]["parish_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string
          cnpj?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string
          icon_url?: string | null
          id?: string
          infinitepay_api_key?: string | null
          infinitepay_configured?: boolean
          logo_url?: string | null
          name?: string
          pagarme_configured?: boolean
          pagarme_secret_key?: string | null
          phone?: string | null
          responsible_name?: string
          slug?: string
          state?: string
          status?: Database["public"]["Enums"]["parish_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parishes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "parish"
      campaign_category:
        | "reforma"
        | "construcao"
        | "eventos"
        | "missas"
        | "caridade"
        | "outros"
      campaign_status: "draft" | "active" | "paused" | "completed" | "cancelled"
      donation_status: "pending" | "processing" | "paid" | "failed" | "refunded"
      parish_status: "pending" | "active" | "inactive"
      payment_method: "credit_card" | "pix" | "boleto"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "parish"],
      campaign_category: [
        "reforma",
        "construcao",
        "eventos",
        "missas",
        "caridade",
        "outros",
      ],
      campaign_status: ["draft", "active", "paused", "completed", "cancelled"],
      donation_status: ["pending", "processing", "paid", "failed", "refunded"],
      parish_status: ["pending", "active", "inactive"],
      payment_method: ["credit_card", "pix", "boleto"],
    },
  },
} as const
