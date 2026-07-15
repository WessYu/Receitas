import { LoadingState } from "@/components/loading-state";

export default function RecipesLoading() {
  return (
    <section className="container-page py-16">
      <LoadingState />
    </section>
  );
}
