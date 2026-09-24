import { Body, Button, Container, Heading, Html, Preview, Text } from "@react-email/components";

/** Double opt-in confirmation (docs/02 W-14). */
export function NewsletterConfirm({ confirmUrl }: { confirmUrl: string }) {
  return (
    <Html lang="en">
      <Preview>Confirm your GlobalMed newsletter subscription</Preview>
      <Body
        style={{ backgroundColor: "#F7F8F6", fontFamily: "Arial, sans-serif", color: "#0F2A3D" }}
      >
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "520px",
          }}
        >
          <Heading as="h1" style={{ fontSize: "22px" }}>
            Confirm your subscription
          </Heading>
          <Text>
            You asked to receive GlobalMed&apos;s monthly billing and coding insights. Confirm your
            email address to start receiving them.
          </Text>
          <Button
            href={confirmUrl}
            style={{
              backgroundColor: "#0E7C7B",
              color: "#FFFFFF",
              padding: "12px 20px",
              borderRadius: "6px",
              fontWeight: 700,
            }}
          >
            Confirm my email
          </Button>
          <Text style={{ color: "#4F6470", fontSize: "14px" }}>
            This link expires in 48 hours. If you didn&apos;t sign up, ignore this email and you
            won&apos;t hear from us.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
