import MaterialView from "@/components/MaterialView";
import { ALL_SUBJECTS, MATERIAL_KEYS } from "@/lib/subjects";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_SUBJECTS.flatMap((s) => MATERIAL_KEYS.map((material) => ({ slug: s.slug, material })));
}

export default function MaterialPage({ params }) {
  return <MaterialView slug={params.slug} material={params.material} />;
}
