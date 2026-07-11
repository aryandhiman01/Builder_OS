import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({

  page: {

    padding: 40,

    backgroundColor: "#ffffff",

  },

  title: {

    fontSize: 24,

    fontWeight: "bold",

    marginBottom: 12,

  },

  subtitle: {

    fontSize: 14,

    color: "#666",

    marginBottom: 25,

  },

  section: {

    marginBottom: 20,

  },

  heading: {

    fontSize: 18,

    fontWeight: "bold",

    marginBottom: 10,

  },

  body: {

    fontSize: 12,

    lineHeight: 1.8,

  },

  footer: {

    marginTop: 30,

    fontSize: 10,

    color: "#999",

  },

});

interface ResearchPDFProps {

  research: {

    title: string;

    prompt: string;

    content: string;

    model: string | null;

    tokens: number | null;

    generationTime: number | null;

    createdAt: Date;

  };

}

export default function ResearchPDF({

  research,

}: ResearchPDFProps) {

      return (

    <Document>

      <Page
        size="A4"
        style={styles.page}
      >

        {/* BuilderOS */}

        <Text
          style={{
            fontSize: 12,
            color: "#666",
            marginBottom: 10,
          }}
        >
          BuilderOS AI Research
        </Text>

        {/* Title */}

        <Text
          style={styles.title}
        >
          {research.title}
        </Text>

        {/* Prompt */}

        <Text
          style={styles.subtitle}
        >
          {research.prompt}
        </Text>

        {/* Metadata */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.heading}
          >
            Research Information
          </Text>

          <Text
            style={styles.body}
          >
            Model: {research.model ?? "AI"}
          </Text>

          <Text
            style={styles.body}
          >
            Tokens: {research.tokens ?? 0}
          </Text>

          <Text
            style={styles.body}
          >
            Generation Time:{" "}
            {research.generationTime ?? 0}s
          </Text>

          <Text
            style={styles.body}
          >
            Created At:{" "}
            {new Date(
              research.createdAt
            ).toLocaleDateString(
              "en-IN"
            )}
          </Text>

        </View>

        {/* Content */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.heading}
          >
            Research
          </Text>

                    <Text
            style={styles.body}
          >
            {research.content}
          </Text>

        </View>

        {/* Footer */}

        <View
          style={styles.footer}
        >

          <Text>
            Generated with BuilderOS
          </Text>

          <Text>
            © {new Date().getFullYear()} BuilderOS
          </Text>

        </View>

      </Page>

    </Document>

  );

}