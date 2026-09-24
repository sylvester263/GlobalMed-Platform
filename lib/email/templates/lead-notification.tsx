import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadNotificationProps = {
  source: string;
  fields: { label: string; value: string }[];
  dashboardUrl: string;
};

/** Internal email to the sales inbox when a lead arrives (docs/02 W-4: within 1 minute). */
export function LeadNotification({ source, fields, dashboardUrl }: LeadNotificationProps) {
  return (
    <Html lang="en">
      <Preview>New lead from {source}</Preview>
      <Body
        style={{ backgroundColor: "#F7F8F6", fontFamily: "Arial, sans-serif", color: "#0F2A3D" }}
      >
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "560px",
          }}
        >
          <Heading as="h1" style={{ fontSize: "22px", margin: "0 0 8px" }}>
            New lead: {source}
          </Heading>
          <Text style={{ color: "#4F6470", margin: "0 0 16px" }}>
            Reply within one business day. Business details only; the form asks for no patient data.
          </Text>
          <Hr style={{ borderColor: "#D9E0DC" }} />
          <Section>
            {fields.map((f) => (
              <Text key={f.label} style={{ margin: "8px 0" }}>
                <strong>{f.label}:</strong> {f.value || "—"}
              </Text>
            ))}
          </Section>
          <Hr style={{ borderColor: "#D9E0DC" }} />
          <Text style={{ fontSize: "14px" }}>Open the leads dashboard: {dashboardUrl}</Text>
        </Container>
      </Body>
    </Html>
  );
}
