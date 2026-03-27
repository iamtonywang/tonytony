import { notFound } from "next/navigation";
import Nigajun44View from "./views/nigajun-44/Nigajun44View";
import Nigajun99View from "./views/nigajun-99/Nigajun99View";
import Nigajun82View from "./views/nigajun-82/Nigajun82View";
import Nigajun77View from "./views/nigajun-77/Nigajun77View";
import Nigajun55View from "./views/nigajun-55/Nigajun55View";
import Nigajun35View from "./views/nigajun-35/Nigajun35View";
import Nigajun28View from "./views/nigajun-28/Nigajun28View";
import Nigajun17View from "./views/nigajun-17/Nigajun17View";

interface ProductViewRouterProps {
  slug: string;
}

export default function ProductViewRouter({ slug }: ProductViewRouterProps) {
  switch (slug) {
    case "nigajun-44":
      return <Nigajun44View />;
    case "nigajun-99":
      return <Nigajun99View />;
    case "nigajun-82":
      return <Nigajun82View />;
    case "nigajun-77":
      return <Nigajun77View />;
    case "nigajun-55":
      return <Nigajun55View />;
    case "nigajun-35":
      return <Nigajun35View />;
    case "nigajun-28":
      return <Nigajun28View />;
    case "nigajun-17":
      return <Nigajun17View />;
    default:
      notFound();
  }
}