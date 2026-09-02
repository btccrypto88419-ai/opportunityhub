import React from "react";
import { Link } from "react-router-dom";
import logoFull from "../../assets/oh-logo-full.png";
import logoIcon from "../../assets/oh-logo-square.png";

/**
 * Official OpportunityHub logo component.
 * variant="full"  -> icon + wordmark + tagline (wide header lockup)
 * variant="icon"  -> icon mark only (compact / mobile / favicons)
 */
export default function Logo({ variant = "full", size = 36, linkTo = "/", className = "" }) {
  const isIcon = variant === "icon";
  const img = (
    <img
      src={isIcon ? logoIcon : logoFull}
      alt="OpportunityHub — Find. Apply. Succeed."
      className={`brand-logo brand-logo-${variant} ${className}`}
      style={
        isIcon
          ? { height: size, width: "auto", display: "block" }
          : { height: size, width: "auto", display: "block" }
      }
      draggable="false"
    />
  );

  if (!linkTo) return img;

  return (
    <Link to={linkTo} className="brand-logo-link" aria-label="OpportunityHub home">
      {img}
    </Link>
  );
}
