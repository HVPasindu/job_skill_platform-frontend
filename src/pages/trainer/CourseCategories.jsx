import { useState } from "react";
import usePagedResource from "../../hooks/usePagedResource";
import { courseService } from "../../services/courseService";
import TrainerHeader from "../../components/trainer/TrainerHeader";
import TrainerDialog from "../../components/trainer/TrainerDialog";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function CourseCategories() {
  const resource = usePagedResource(courseService.categories);
  const [adding, setAdding] = useState(false);
  return (
    <>
      <TrainerHeader
        title={
          <>
            Good ideas.
            <br />
            <em>Easy to find.</em>
          </>
        }
        description="Shared course categories help learners find the right next step."
      />
      <div className="seeker-toolbar">
        <h2>Course categories.</h2>
        <Button onClick={() => setAdding(true)}>Add category +</Button>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.categories.length ? (
        <section className="seeker-empty">
          <h2>A place for every idea.</h2>
          <p>Add the first course category.</p>
        </section>
      ) : (
        <div className="trainer-category-grid">
          {resource.data.categories.map((c) => (
            <article key={c.id}>
              <span>↗</span>
              <h3>{c.category_name}</h3>
              <small>Shared course category</small>
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Course category pages"
      />
      {adding && (
        <TrainerDialog
          title="Add course category"
          fields={[
            {
              name: "category_name",
              label: "Category name",
              required: true,
              max: 100,
            },
          ]}
          onClose={() => setAdding(false)}
          onSave={(values) =>
            courseService.addCategory({
              category_name: values.category_name.trim(),
            })
          }
          onSaved={resource.reload}
        />
      )}
    </>
  );
}
