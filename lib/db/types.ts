// PROVISIONAL — generated from supabase/migrations (0001 + 0002 details column) by a local script because the
// Supabase project is not linked yet. Replace with `npm run db:types` once linked.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          certificate_name: string | null;
          role: Database["public"]["Enums"]["user_role"];
          country: string | null;
          phone: string | null;
          avatar_path: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          certificate_name?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          country?: string | null;
          phone?: string | null;
          avatar_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          certificate_name?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          country?: string | null;
          phone?: string | null;
          avatar_path?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          type: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          type: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          type?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          description_md: string | null;
          outcomes: string[] | null;
          level: string | null;
          category_id: string | null;
          instructor_id: string | null;
          thumbnail_path: string | null;
          price_usd: number;
          price_pkr: number | null;
          access_months: number | null;
          pass_pct: number;
          status: Database["public"]["Enums"]["course_status"];
          seo: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string | null;
          description_md?: string | null;
          outcomes?: string[] | null;
          level?: string | null;
          category_id?: string | null;
          instructor_id?: string | null;
          thumbnail_path?: string | null;
          price_usd?: number;
          price_pkr?: number | null;
          access_months?: number | null;
          pass_pct?: number;
          status?: Database["public"]["Enums"]["course_status"];
          seo?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string | null;
          description_md?: string | null;
          outcomes?: string[] | null;
          level?: string | null;
          category_id?: string | null;
          instructor_id?: string | null;
          thumbnail_path?: string | null;
          price_usd?: number;
          price_pkr?: number | null;
          access_months?: number | null;
          pass_pct?: number;
          status?: Database["public"]["Enums"]["course_status"];
          seo?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          position: number;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          position?: number;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          position?: number;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          type: Database["public"]["Enums"]["lesson_type"];
          title: string;
          position: number;
          bunny_video_id: string | null;
          duration_sec: number | null;
          content_md: string | null;
          live_url: string | null;
          is_preview: boolean;
          unlock_rule: Json | null;
        };
        Insert: {
          id?: string;
          module_id: string;
          type?: Database["public"]["Enums"]["lesson_type"];
          title: string;
          position?: number;
          bunny_video_id?: string | null;
          duration_sec?: number | null;
          content_md?: string | null;
          live_url?: string | null;
          is_preview?: boolean;
          unlock_rule?: Json | null;
        };
        Update: {
          id?: string;
          module_id?: string;
          type?: Database["public"]["Enums"]["lesson_type"];
          title?: string;
          position?: number;
          bunny_video_id?: string | null;
          duration_sec?: number | null;
          content_md?: string | null;
          live_url?: string | null;
          is_preview?: boolean;
          unlock_rule?: Json | null;
        };
        Relationships: [];
      };
      lesson_resources: {
        Row: {
          id: string;
          lesson_id: string;
          label: string;
          storage_path: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          label: string;
          storage_path: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          label?: string;
          storage_path?: string;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          source: string;
          status: Database["public"]["Enums"]["enrollment_status"];
          starts_at: string;
          expires_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          source?: string;
          status?: Database["public"]["Enums"]["enrollment_status"];
          starts_at?: string;
          expires_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          source?: string;
          status?: Database["public"]["Enums"]["enrollment_status"];
          starts_at?: string;
          expires_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          enrollment_id: string;
          lesson_id: string;
          position_sec: number;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          enrollment_id: string;
          lesson_id: string;
          position_sec?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          enrollment_id?: string;
          lesson_id?: string;
          position_sec?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          course_id: string;
          lesson_id: string | null;
          kind: Database["public"]["Enums"]["quiz_kind"];
          title: string;
          time_limit_min: number | null;
          pass_pct: number;
          attempts_allowed: number | null;
          question_count: number | null;
          randomize: boolean;
        };
        Insert: {
          id?: string;
          course_id: string;
          lesson_id?: string | null;
          kind?: Database["public"]["Enums"]["quiz_kind"];
          title: string;
          time_limit_min?: number | null;
          pass_pct?: number;
          attempts_allowed?: number | null;
          question_count?: number | null;
          randomize?: boolean;
        };
        Update: {
          id?: string;
          course_id?: string;
          lesson_id?: string | null;
          kind?: Database["public"]["Enums"]["quiz_kind"];
          title?: string;
          time_limit_min?: number | null;
          pass_pct?: number;
          attempts_allowed?: number | null;
          question_count?: number | null;
          randomize?: boolean;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          quiz_id: string;
          type: string;
          prompt: string;
          options: Json;
          correct: Json;
          explanation: string | null;
          tag: string | null;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          type: string;
          prompt: string;
          options: Json;
          correct: Json;
          explanation?: string | null;
          tag?: string | null;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          type?: string;
          prompt?: string;
          options?: Json;
          correct?: Json;
          explanation?: string | null;
          tag?: string | null;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          user_id: string;
          question_ids: string[];
          answers: Json | null;
          score_pct: number | null;
          passed: boolean | null;
          started_at: string;
          submitted_at: string | null;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          user_id: string;
          question_ids: string[];
          answers?: Json | null;
          score_pct?: number | null;
          passed?: boolean | null;
          started_at?: string;
          submitted_at?: string | null;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          user_id?: string;
          question_ids?: string[];
          answers?: Json | null;
          score_pct?: number | null;
          passed?: boolean | null;
          started_at?: string;
          submitted_at?: string | null;
        };
        Relationships: [];
      };
      bundles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          price_usd: number;
          price_pkr: number | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          price_usd: number;
          price_pkr?: number | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          price_usd?: number;
          price_pkr?: number | null;
        };
        Relationships: [];
      };
      bundle_courses: {
        Row: {
          bundle_id: string | null;
          course_id: string | null;
        };
        Insert: {
          bundle_id?: string | null;
          course_id?: string | null;
        };
        Update: {
          bundle_id?: string | null;
          course_id?: string | null;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          kind: string;
          value: number;
          max_uses: number | null;
          used: number;
          expires_at: string | null;
          active: boolean;
        };
        Insert: {
          id?: string;
          code: string;
          kind: string;
          value: number;
          max_uses?: number | null;
          used?: number;
          expires_at?: string | null;
          active?: boolean;
        };
        Update: {
          id?: string;
          code?: string;
          kind?: string;
          value?: number;
          max_uses?: number | null;
          used?: number;
          expires_at?: string | null;
          active?: boolean;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: Database["public"]["Enums"]["order_status"];
          currency: string;
          subtotal: number;
          discount: number;
          total: number;
          coupon_id: string | null;
          provider: string;
          provider_ref: string | null;
          proof_path: string | null;
          verified_by: string | null;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: Database["public"]["Enums"]["order_status"];
          currency?: string;
          subtotal: number;
          discount?: number;
          total: number;
          coupon_id?: string | null;
          provider: string;
          provider_ref?: string | null;
          proof_path?: string | null;
          verified_by?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: Database["public"]["Enums"]["order_status"];
          currency?: string;
          subtotal?: number;
          discount?: number;
          total?: number;
          coupon_id?: string | null;
          provider?: string;
          provider_ref?: string | null;
          proof_path?: string | null;
          verified_by?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          course_id: string | null;
          bundle_id: string | null;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          course_id?: string | null;
          bundle_id?: string | null;
          price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          course_id?: string | null;
          bundle_id?: string | null;
          price?: number;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          code: string;
          user_id: string;
          course_id: string;
          name_on_cert: string;
          issued_at: string;
          pdf_path: string | null;
          status: Database["public"]["Enums"]["cert_status"];
        };
        Insert: {
          id?: string;
          code?: string;
          user_id: string;
          course_id: string;
          name_on_cert: string;
          issued_at?: string;
          pdf_path?: string | null;
          status?: Database["public"]["Enums"]["cert_status"];
        };
        Update: {
          id?: string;
          code?: string;
          user_id?: string;
          course_id?: string;
          name_on_cert?: string;
          issued_at?: string;
          pdf_path?: string | null;
          status?: Database["public"]["Enums"]["cert_status"];
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          source: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          practice_name: string | null;
          specialty: string | null;
          interest: string | null;
          message: string | null;
          utm: Json | null;
          status: Database["public"]["Enums"]["lead_status"];
          assigned_to: string | null;
          created_at: string;
          details: Json;
        };
        Insert: {
          id?: string;
          source: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          practice_name?: string | null;
          specialty?: string | null;
          interest?: string | null;
          message?: string | null;
          utm?: Json | null;
          status?: Database["public"]["Enums"]["lead_status"];
          assigned_to?: string | null;
          created_at?: string;
          details?: Json;
        };
        Update: {
          id?: string;
          source?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          practice_name?: string | null;
          specialty?: string | null;
          interest?: string | null;
          message?: string | null;
          utm?: Json | null;
          status?: Database["public"]["Enums"]["lead_status"];
          assigned_to?: string | null;
          created_at?: string;
          details?: Json;
        };
        Relationships: [];
      };
      lead_notes: {
        Row: {
          id: string;
          lead_id: string;
          author_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          author_id?: string | null;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          author_id?: string | null;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body_md: string | null;
          cover_path: string | null;
          category_id: string | null;
          author_id: string | null;
          seo: Json | null;
          status: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          body_md?: string | null;
          cover_path?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          seo?: Json | null;
          status?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          body_md?: string | null;
          cover_path?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          seo?: Json | null;
          status?: string;
          published_at?: string | null;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          slug: string;
          blocks: Json;
          seo: Json | null;
          updated_at: string | null;
        };
        Insert: {
          slug: string;
          blocks?: Json;
          seo?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          slug?: string;
          blocks?: Json;
          seo?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string | null;
          role: string | null;
          quote: string | null;
          audience: string | null;
          published: boolean | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          role?: string | null;
          quote?: string | null;
          audience?: string | null;
          published?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          role?: string | null;
          quote?: string | null;
          audience?: string | null;
          published?: boolean | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string | null;
          answer: string | null;
          topic: string | null;
          position: number | null;
          published: boolean | null;
        };
        Insert: {
          id?: string;
          question?: string | null;
          answer?: string | null;
          topic?: string | null;
          position?: number | null;
          published?: boolean | null;
        };
        Update: {
          id?: string;
          question?: string | null;
          answer?: string | null;
          topic?: string | null;
          position?: number | null;
          published?: boolean | null;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          key: string;
          value: Json | null;
        };
        Insert: {
          key: string;
          value?: Json | null;
        };
        Update: {
          key?: string;
          value?: Json | null;
        };
        Relationships: [];
      };
      kb_documents: {
        Row: {
          id: string;
          title: string;
          source: string | null;
          body: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          source?: string | null;
          body: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          source?: string | null;
          body?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      kb_chunks: {
        Row: {
          id: string;
          document_id: string;
          content: string;
          embedding: string | null;
        };
        Insert: {
          id?: string;
          document_id: string;
          content: string;
          embedding?: string | null;
        };
        Update: {
          id?: string;
          document_id?: string;
          content?: string;
          embedding?: string | null;
        };
        Relationships: [];
      };
      chat_conversations: {
        Row: {
          id: string;
          channel: Database["public"]["Enums"]["chat_channel"];
          visitor_id: string | null;
          wa_id: string | null;
          lead_id: string | null;
          handoff: boolean;
          assigned_to: string | null;
          created_at: string;
          last_message_at: string | null;
        };
        Insert: {
          id?: string;
          channel: Database["public"]["Enums"]["chat_channel"];
          visitor_id?: string | null;
          wa_id?: string | null;
          lead_id?: string | null;
          handoff?: boolean;
          assigned_to?: string | null;
          created_at?: string;
          last_message_at?: string | null;
        };
        Update: {
          id?: string;
          channel?: Database["public"]["Enums"]["chat_channel"];
          visitor_id?: string | null;
          wa_id?: string | null;
          lead_id?: string | null;
          handoff?: boolean;
          assigned_to?: string | null;
          created_at?: string;
          last_message_at?: string | null;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      lesson_questions: {
        Row: {
          id: string;
          lesson_id: string | null;
          user_id: string | null;
          body: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          lesson_id?: string | null;
          user_id?: string | null;
          body: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          lesson_id?: string | null;
          user_id?: string | null;
          body?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      lesson_answers: {
        Row: {
          id: string;
          question_id: string | null;
          user_id: string | null;
          body: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          question_id?: string | null;
          user_id?: string | null;
          body: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          question_id?: string | null;
          user_id?: string | null;
          body?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string | null;
          body: string | null;
          link: string | null;
          read_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title?: string | null;
          body?: string | null;
          link?: string | null;
          read_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string | null;
          body?: string | null;
          link?: string | null;
          read_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: number;
          actor_id: string | null;
          action: string | null;
          entity: string | null;
          entity_id: string | null;
          diff: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          action?: string | null;
          entity?: string | null;
          entity_id?: string | null;
          diff?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          actor_id?: string | null;
          action?: string | null;
          entity?: string | null;
          entity_id?: string | null;
          diff?: Json | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      has_role: { Args: { r: Database["public"]["Enums"]["user_role"] }; Returns: boolean };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_enrolled: { Args: { c: string }; Returns: boolean };
      match_kb: {
        Args: { query_embedding: string; match_count?: number };
        Returns: { id: string; content: string; similarity: number }[];
      };
      verify_certificate: {
        Args: { p_code: string };
        Returns: {
          name_on_cert: string;
          course_title: string;
          issued_at: string;
          status: Database["public"]["Enums"]["cert_status"];
        }[];
      };
    };
    Enums: {
      user_role: "student" | "instructor" | "sales" | "admin";
      course_status: "draft" | "published" | "archived";
      lesson_type: "video" | "text" | "pdf" | "quiz" | "assignment" | "live";
      enrollment_status: "active" | "expired" | "revoked";
      order_status: "pending" | "awaiting_verification" | "paid" | "failed" | "refunded" | "cancelled";
      quiz_kind: "quiz" | "exam";
      lead_status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
      cert_status: "valid" | "revoked";
      chat_channel: "web" | "whatsapp";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];
