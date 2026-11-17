import PostCatalog from "@/components/PostCatalog";

const reunionTypes = ["lost", "found"];

export default function Reunions() {
  return (
    <PostCatalog
      types={reunionTypes}
      status="resolved"
      label="de volta para casa"
      searchOnly
    />
  );
}
