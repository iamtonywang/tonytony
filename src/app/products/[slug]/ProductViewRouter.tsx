import { notFound } from "next/navigation";
import type { ProductBoardItem, ProductMinimal } from "../_server/types";
import Nigajun44View from "./views/nigajun-44/Nigajun44View";
import Nigajun99View from "./views/nigajun-99/Nigajun99View";
import Nigajun88View from "./views/nigajun-88/Nigajun88View";
import Nigajun77View from "./views/nigajun-77/Nigajun77View";
import Nigajun55View from "./views/nigajun-55/Nigajun55View";
import Nigajun22View from "./views/nigajun-22/Nigajun22View";
import Nigajun11View from "./views/nigajun-11/Nigajun11View";
import Nigajun17View from "./views/nigajun-17/Nigajun17View";

interface ProductViewRouterProps {
  slug: string;
  product?: ProductMinimal;
  boardItems: ProductBoardItem[];
}

export default function ProductViewRouter({ slug, product, boardItems }: ProductViewRouterProps) {
  switch (slug) {
    case "nigajun-44":
      return <Nigajun44View product={product} boardItems={boardItems} />;
    case "nigajun-99":
      return <Nigajun99View product={product} boardItems={boardItems} />;
    case "nigajun-88":
      return <Nigajun88View product={product} boardItems={boardItems} />;
    case "nigajun-77":
      return <Nigajun77View product={product} boardItems={boardItems} />;
    case "nigajun-55":
      return <Nigajun55View product={product} boardItems={boardItems} />;
    case "nigajun-22":
      return <Nigajun22View product={product} boardItems={boardItems} />;
    case "nigajun-11":
      return <Nigajun11View product={product} boardItems={boardItems} />;
    case "nigajun-17":
      return <Nigajun17View product={product} boardItems={boardItems} />;
    default:
      notFound();
  }
}