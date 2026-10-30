import { useState } from "react";
import { useOutletContext } from "react-router-dom";
// useForm manages validation and busy states. MUI fields are connected through Controller.
import { useForm } from "react-hook-form";
import SeekerHeader from "../../components/seeker/SeekerHeader";
import SeekerField from "../../components/seeker/SeekerField";
import FilePicker from "../../components/seeker/FilePicker";
import Button from "../../components/ui/Button";
import { profileFields } from "../../data/seekerFields";
import { seekerService } from "../../services/seekerService";
import { fileUrl } from "../../utils/seekerFiles";
import { showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import useAuth from "../../hooks/useAuth";
export default function Profile() {
  const { profile, refreshProfile } = useOutletContext();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: Object.fromEntries(
      profileFields.map((field) => [field.name, profile?.[field.name] ?? ""]),
    ),
  });
  async function submit(values) {
    try {
      const payload = new FormData();
      Object.entries(values).forEach(([key, value]) =>
        payload.append(key, String(value).trim()),
      );
      if (image) payload.append("profile_image", image);
      await seekerService.saveProfile(payload, !!profile);
      await showSuccess(
        profile ? "Your story, updated" : "Your profile is ready",
        "Now bring your education, experience and skills into the picture.",
      );
      refreshProfile();
    } catch (error) {
      await showError(getApiError(error));
    }
  }
  return (
    <>
      <SeekerHeader
        eyebrow="01 / YOUR STORY STARTS HERE"
        title={
          <>
            Be more than
            <br />a name.
          </>
        }
        description="A little about you. A clear direction for what comes next."
      />
      <form
        className="seeker-profile-form"
        noValidate
        onSubmit={handleSubmit(submit)}
      >
        <section className="seeker-panel profile-identity">
          <FilePicker
            image
            label="Choose profile photo"
            existingImage={fileUrl(profile?.profile_image_url)}
            onChange={(files) => setImage(files[0] || null)}
            disabled={isSubmitting}
          />
          <div>
            <span className="eyebrow">THIS IS YOU</span>
            <h2>{profile?.full_name || user.full_name}</h2>
            <p>{profile?.email || user.email}</p>
            <span className="seeker-status">
              {profile ? "Profile saved" : "Your first introduction"}
            </span>
            <p className="form-hint">
              Name and email come from your account. A selected photo is
              uploaded when you save.
            </p>
          </div>
        </section>
        <section className="seeker-panel">
          <div className="seeker-section-title">
            <div>
              <span className="eyebrow">THE DETAILS THAT CONNECT YOU</span>
              <h2>Your next direction.</h2>
            </div>
            <span>✦</span>
          </div>
          <div className="seeker-form-grid">
            {profileFields.map((field) => (
              <SeekerField
                key={field.name}
                definition={field}
                control={control}
                disabled={isSubmitting}
              />
            ))}
          </div>
          <div className="seeker-form-actions">
            <p>Fields marked * complete your profile.</p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving your story…"
                : profile
                  ? "Save profile →"
                  : "Create my profile →"}
            </Button>
          </div>
        </section>
      </form>
    </>
  );
}
