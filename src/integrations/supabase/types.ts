export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_factors: {
        Row: {
          app_id: string | null
          created_at: string | null
          description: string
          id: string
          name: string
          present: boolean
        }
        Insert: {
          app_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          present?: boolean
        }
        Update: {
          app_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          present?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "app_factors_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      apps: {
        Row: {
          business_model: string | null
          category: string
          created_at: string | null
          description: string | null
          developer: string
          icon: string | null
          id: string
          last_updated: string | null
          name: string
          rating: Database["public"]["Enums"]["drug_rating"]
          store: Database["public"]["Enums"]["app_store"]
          store_app_id: string | null
        }
        Insert: {
          business_model?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          developer: string
          icon?: string | null
          id?: string
          last_updated?: string | null
          name: string
          rating: Database["public"]["Enums"]["drug_rating"]
          store: Database["public"]["Enums"]["app_store"]
          store_app_id?: string | null
        }
        Update: {
          business_model?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          developer?: string
          icon?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          rating?: Database["public"]["Enums"]["drug_rating"]
          store?: Database["public"]["Enums"]["app_store"]
          store_app_id?: string | null
        }
        Relationships: []
      }
      apps_backup: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          developer: string | null
          icon: string | null
          id: string | null
          last_updated: string | null
          name: string | null
          store: Database["public"]["Enums"]["app_store"] | null
          store_app_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          developer?: string | null
          icon?: string | null
          id?: string | null
          last_updated?: string | null
          name?: string | null
          store?: Database["public"]["Enums"]["app_store"] | null
          store_app_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          developer?: string | null
          icon?: string | null
          id?: string | null
          last_updated?: string | null
          name?: string | null
          store?: Database["public"]["Enums"]["app_store"] | null
          store_app_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_store: "Apple App Store" | "Google Play" | "Both"
      drug_rating: "Tool" | "Sugar" | "Coffee" | "Alcohol" | "Drug"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_store: ["Apple App Store", "Google Play", "Both"],
      drug_rating: ["Tool", "Sugar", "Coffee", "Alcohol", "Drug"],
    },
  },
} as const
