import DefaultTheme from "vitepress/theme";
import "./style.css";
import Layout from "./Layout.vue";
import MarketingPage from "../components/MarketingPage.vue";

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component("MarketingPage", MarketingPage);
  },
};
