import { Button, Container, Text, Title } from "@mantine/core";
import classes from "@/app/styles/HeroSection.module.css";
import { Dots } from "./Dots";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots
        className={classes.dots}
        style={{
          left: 0,
          top: 0,
        }}
      />
      <Dots
        className={classes.dots}
        style={{
          left: 60,
          top: 0,
        }}
      />
      <Dots
        className={classes.dots}
        style={{
          left: 0,
          top: 140,
        }}
      />
      <Dots
        className={classes.dots}
        style={{
          right: 0,
          top: 60,
        }}
      />

      <div className={classes.inner}>
        <Title className={classes.title}>
          A platform for{" "}
          <Text component="span" className={classes.highlight} inherit>
            Capture The Flag
          </Text>{" "}
          challenges & competitions!
        </Title>
      </div>

      <div className={classes.controls}>
        <Link href="/auth" style={{ textDecoration: "none", marginRight: 20 }}>
          <Button className={classes.control} size="xl" color="cyan">
            Get started!
          </Button>
        </Link>
        <Button className={classes.control} size="xl" color="red">
          Learn more
        </Button>
      </div>
    </Container>
  );
};

export { HeroSection };
