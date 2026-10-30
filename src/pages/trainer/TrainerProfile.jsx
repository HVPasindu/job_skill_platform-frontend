import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { courseService } from "../../services/courseService";
import { trainerFields, trainerPayload } from "../../data/trainerFields";
import FormField from "../../components/employer/EmployerField";
import FilePicker from "../../components/seeker/FilePicker";
import TrainerHeader from "../../components/trainer/TrainerHeader";
import Button from "../../components/ui/Button";
import { fileUrl } from "../../utils/seekerFiles";
import { showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
export default function TrainerProfile() {
  const { profile, reloadProfile } = useOutletContext();
  const [image, setImage] = useState(null);
  // React Hook Form owns the simple inputs; the existing image picker handles file validation/preview.
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: Object.fromEntries(
      trainerFields.map((f) => [f.name, profile?.[f.name] ?? ""]),
    ),
  });
  async function submit(values) {
    if (
      values.years_of_experience !== "" &&
      !Number.isInteger(Number(values.years_of_experience))
    ) {
      setError("years_of_experience", {
        message: "Use a whole number of years.",
      });
      return;
    }
    try {
      await courseService.saveProfile(trainerPayload(values, image), !!profile);
      await showSuccess(
        "Your next chapter, introduced",
        "Your trainer profile has been saved.",
      );
      reloadProfile();
    } catch (error) {
      await showError(getApiError(error));
    }
  }
  return (
    <>
      <TrainerHeader
        title={
          <>
            Your experience.
            <br />
            <em>Their next chapter.</em>
          </>
        }
        description="Introduce the person behind the knowledge. Give learners a reason to be curious."
      />
      <form className="seeker-panel" noValidate onSubmit={handleSubmit(submit)}>
        <div className="trainer-profile-intro">
          <div>
            <span className="eyebrow">THE PERSON BEHIND THE POSSIBILITIES</span>
            <h2>
              {profile ? "Your trainer profile." : "Start with your story."}
            </h2>
            <p>Your platform account name and email stay with your account.</p>
          </div>
          <FilePicker
            image
            label="Choose trainer photo"
            existingImage={fileUrl(profile?.profile_image_url)}
            disabled={isSubmitting}
            onChange={(files) => setImage(files[0] || null)}
          />
        </div>
        <div className="seeker-form-grid">
          {trainerFields.map((f) => (
            <FormField
              key={f.name}
              definition={f}
              control={control}
              disabled={isSubmitting}
            />
          ))}
        </div>
        <div className="seeker-form-actions">
          <p>A clear introduction helps the right learners find you.</p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving your story…"
              : profile
                ? "Save trainer profile →"
                : "Create trainer profile →"}
          </Button>
        </div>
      </form>
    </>
  );
}
