# UI Migration Guide

This guide details how to migrate and use components from the `TailwindPlus` library into the `PB-Next` project.

## Directory Structure
- **Source:** `TailwindPlus/components/[category]/[subcategory]/[file].jsx`
- **Destination:** `web/src/components/[category]/[component-name].tsx`

## Migration Rules Applied
1.  **Framework Adaptation:**
    *   `<a>` tags converted to `Link` from `next/link`.
    *   `<img>` tags converted to `Image` from `next/image`.
    *   `class` attributes renamed to `className`.
2.  **Type Safety:**
    *   Components converted to TypeScript interfaces (e.g., `HeroSplitWithImageProps`).
    *   Props are optional with sensible defaults matching the original design.
3.  **Styling:**
    *   `cn()` utility used for class merging.
    *   Dark mode support added where applicable (`dark:text-white`, etc).

## Migrated Components

### 1. Hero Split With Image
**Source:** `marketing/sections/heroes/split_with_image.jsx`
**Location:** `src/components/marketing/hero-split-with-image.tsx`

#### Usage
```tsx
import HeroSplitWithImage from "@/components/marketing/hero-split-with-image";

export default function Page() {
  return (
    <HeroSplitWithImage 
      title="Build your next idea"
      primaryAction={{ label: "Get Started", href: "/signup" }}
    />
  );
}
```

### 2. Feature Grid
**Source:** `marketing/sections/feature-sections/centered_2x2_grid.jsx`
**Location:** `src/components/marketing/feature-grid.tsx`

#### Usage
```tsx
import FeatureGrid from "@/components/marketing/feature-grid";
import { Zap, Shield, Globe, BarChart } from "lucide-react";

export default function Page() {
  const features = [
    { name: 'Fast', description: 'Super fast', icon: Zap },
    { name: 'Secure', description: 'Very secure', icon: Shield },
    { name: 'Global', description: 'Worldwide locations', icon: Globe },
    { name: 'Analytics', description: 'Deep insights', icon: BarChart },
  ];

  return (
    <FeatureGrid 
      title="Why choose us?" 
      subtitle="Everything you need"
      features={features} 
    />
  );
}
```

### 3. Pricing Table
**Source:** `marketing/sections/pricing/three_tiers.jsx`
**Location:** `src/components/marketing/pricing-table.tsx`

#### Usage
```tsx
import PricingTable from "@/components/marketing/pricing-table";

export default function Page() {
  return (
    <PricingTable 
      title="Simple Pricing" 
      subtitle="Start free, upgrade later"
    />
  );
}
```

### 4. Sidebar Shell (Dashboard Layout)
**Source:** `application-ui/application-shells/sidebar/dark_sidebar.jsx`
**Location:** `src/components/layout/sidebar-shell.tsx`

#### Usage
Wrap your dashboard pages with this shell. It handles the sidebar and the main content area.
```tsx
// src/app/dashboard/layout.tsx
import SidebarShell from "@/components/layout/sidebar-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell>
      {children}
    </SidebarShell>
  );
}
```

### 5. Settings Form
**Source:** `application-ui/forms/form-layouts/stacked.jsx`
**Location:** `src/components/forms/settings-form.tsx`

#### Usage
```tsx
import SettingsForm from "@/components/forms/settings-form";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <SettingsForm />
    </div>
  );
}
```

### 6. Footer
**Source:** `marketing/sections/footers/4_column_with_company_mission_on_dark.jsx`
**Location:** `src/components/marketing/footer.tsx`

#### Usage
```tsx
import Footer from "@/components/marketing/footer";

export default function Page() {
  return (
    <div>
      <main>...</main>
      <Footer />
    </div>
  );
}
```

### 7. Testimonials
**Source:** `marketing/sections/testimonials/side_by_side_on_dark.jsx`
**Location:** `src/components/marketing/testimonials.tsx`

#### Usage
```tsx
import Testimonials from "@/components/marketing/testimonials";
// ...
<Testimonials />
```

### 8. CTA (Call to Action)
**Source:** `marketing/sections/cta-sections/simple_centered_on_dark.jsx`
**Location:** `src/components/marketing/cta-centered.tsx`

#### Usage
```tsx
import CtaCentered from "@/components/marketing/cta-centered";
// ...
<CtaCentered />
```

### 9. Stats
**Source:** `marketing/sections/stats-sections/simple_grid_on_dark.jsx`
**Location:** `src/components/marketing/stats-simple.tsx`

#### Usage
```tsx
import StatsSimple from "@/components/marketing/stats-simple";
// ...
<StatsSimple />
```

### 10. FAQ
**Source:** `marketing/sections/faq-sections/centered_accordion_on_dark.jsx`
**Location:** `src/components/marketing/faq-centered.tsx`

#### Usage
```tsx
import FaqCentered from "@/components/marketing/faq-centered";
// ...
<FaqCentered />
```

### 11. Stacked List
**Source:** `application-ui/lists/stacked-lists/simple_on_dark.jsx`
**Location:** `src/components/application-ui/lists/stacked-list.tsx`

#### Usage
```tsx
import StackedList from "@/components/application-ui/lists/stacked-list";
// ...
<StackedList />
```

### 12. Table
**Source:** `application-ui/lists/tables/simple_on_dark.jsx`
**Location:** `src/components/application-ui/lists/table.tsx`

#### Usage
```tsx
import Table from "@/components/application-ui/lists/table";
// ...
<Table />
```

### 13. Modal
**Source:** `application-ui/overlays/modal-dialogs/centered_with_wide_buttons.jsx`
**Location:** `src/components/application-ui/overlays/modal.tsx`

#### Usage
```tsx
"use client";
import { useState } from "react";
import Modal from "@/components/application-ui/overlays/modal";

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal open={open} setOpen={setOpen} />
    </>
  );
}
```

### 14. Description List
**Source:** `application-ui/data-display/description-lists/left_aligned_on_dark.jsx`
**Location:** `src/components/application-ui/data-display/description-list.tsx`

#### Usage
```tsx
import DescriptionList from "@/components/application-ui/data-display/description-list";
// ...
<DescriptionList />
```

### 15. Badge
**Source:** `application-ui/elements/badges/with_border_on_dark.jsx`
**Location:** `src/components/application-ui/elements/badge.tsx`

#### Usage
```tsx
import Badge from "@/components/application-ui/elements/badge";
<Badge label="New" color="indigo" />
```

### 16. Button
**Source:** `application-ui/elements/buttons/primary_buttons.jsx`
**Location:** `src/components/application-ui/elements/button.tsx`

#### Usage
```tsx
import Button from "@/components/application-ui/elements/button";
<Button variant="primary">Click Me</Button>
```

### 17. Avatar
**Source:** `application-ui/elements/avatars/circular_avatars.jsx`
**Location:** `src/components/application-ui/elements/avatar.tsx`

#### Usage
```tsx
import Avatar from "@/components/application-ui/elements/avatar";
<Avatar src="/profile.jpg" size="md" />
```

### 18. Tabs
**Source:** `application-ui/navigation/tabs/tabs_with_underline.jsx`
**Location:** `src/components/application-ui/navigation/tabs.tsx`

#### Usage
```tsx
import Tabs from "@/components/application-ui/navigation/tabs";
const tabs = [{ name: 'Account', href: '#', current: true }, ...];
<Tabs tabs={tabs} />
```

### 19. Alert
**Source:** `application-ui/feedback/alerts/with_description.jsx`
**Location:** `src/components/application-ui/feedback/alert.tsx`

#### Usage
```tsx
import Alert from "@/components/application-ui/feedback/alert";
<Alert title="Success!" variant="success" />
```

### 20. Input
**Source:** `application-ui/forms/input-groups/input_with_label.jsx`
**Location:** `src/components/application-ui/forms/input.tsx`

#### Usage
```tsx
import Input from "@/components/application-ui/forms/input";
<Input label="Email" error={errors.email} placeholder="john@example.com" />
```

### 21. Textarea
**Source:** `application-ui/forms/textareas/simple.jsx`
**Location:** `src/components/application-ui/forms/textarea.tsx`

#### Usage
```tsx
import Textarea from "@/components/application-ui/forms/textarea";
<Textarea label="Bio" rows={3} />
```

### 22. Select
**Source:** `application-ui/forms/select-menus/simple_custom.jsx`
**Location:** `src/components/application-ui/forms/select.tsx`

#### Usage
```tsx
import Select from "@/components/application-ui/forms/select";
const [selected, setSelected] = useState(options[0]);
<Select label="Role" options={[{id: 1, name: 'Admin'}]} value={selected} onChange={setSelected} />
```

### 23. Toggle
**Source:** `application-ui/forms/toggles/simple_toggle.jsx`
**Location:** `src/components/application-ui/forms/toggle.tsx`

#### Usage
```tsx
import Toggle from "@/components/application-ui/forms/toggle";
<Toggle label="Notifications" checked={enabled} onChange={setEnabled} />
```

### 24. Checkbox
**Source:** Custom / `application-ui/forms/checkboxes`
**Location:** `src/components/application-ui/forms/checkbox.tsx`

#### Usage
```tsx
import Checkbox from "@/components/application-ui/forms/checkbox";
<Checkbox label="I agree" />
```

### 25. Dropdown
**Source:** `application-ui/elements/dropdowns/simple.jsx`
**Location:** `src/components/application-ui/elements/dropdown.tsx`

#### Usage
```tsx
import Dropdown from "@/components/application-ui/elements/dropdown";
<Dropdown label="Menu" items={[{ label: 'Edit', onClick: () => {} }]} />
```

### 26. Pagination
**Source:** `application-ui/navigation/pagination/centered_page_numbers.jsx`
**Location:** `src/components/application-ui/navigation/pagination.tsx`

#### Usage
```tsx
import Pagination from "@/components/application-ui/navigation/pagination";
<Pagination currentPage={1} totalPages={10} onPageChange={setPage} />
```

### 27. Breadcrumbs
**Source:** `application-ui/navigation/breadcrumbs/simple_with_chevrons.jsx`
**Location:** `src/components/application-ui/navigation/breadcrumbs.tsx`

#### Usage
```tsx
import Breadcrumbs from "@/components/application-ui/navigation/breadcrumbs";
<Breadcrumbs pages={[{ name: 'Home', href: '/', current: false }]} />
```

### 28. Empty State
**Source:** `application-ui/feedback/empty-states/with_dashed_border.jsx`
**Location:** `src/components/application-ui/feedback/empty-state.tsx`

#### Usage
```tsx
import EmptyState from "@/components/application-ui/feedback/empty-state";
<EmptyState title="No items" action={{ label: "Create", onClick: () => {} }} />
```

### 29. Slide-over
**Source:** `application-ui/overlays/drawers/with_close_button_on_outside.jsx`
**Location:** `src/components/application-ui/overlays/slide-over.tsx`

#### Usage
```tsx
import SlideOver from "@/components/application-ui/overlays/slide-over";
<SlideOver open={open} setOpen={setOpen} title="Panel">...</SlideOver>
```

### 30. Divider
**Source:** `application-ui/layout/dividers/with_label.jsx`
**Location:** `src/components/application-ui/layout/divider.tsx`

#### Usage
```tsx
import Divider from "@/components/application-ui/layout/divider";
<Divider label="Continue" />
```

### 31. Steps
**Source:** `application-ui/navigation/progress-bars/circles.jsx`
**Location:** `src/components/application-ui/navigation/steps.tsx`

#### Usage
```tsx
import Steps from "@/components/application-ui/navigation/steps";
<Steps steps={[{id:'01', name:'Step 1', status:'current'}]} />
```

### 32. Radio Group
**Source:** `application-ui/forms/radio-groups/simple_list.jsx`
**Location:** `src/components/application-ui/forms/radio-group.tsx`

#### Usage
```tsx
import RadioGroup from "@/components/application-ui/forms/radio-group";
<RadioGroup options={[{id:1, title:'Opt 1'}]} value={val} onChange={setVal} />
```

### 33. Action Panel
**Source:** `application-ui/forms/action-panels/simple.jsx`
**Location:** `src/components/application-ui/forms/action-panel.tsx`

#### Usage
```tsx
import ActionPanel from "@/components/application-ui/forms/action-panel";
<ActionPanel title="Upgrade" description="Get more" action={{label:'Buy'}} />
```

### 34. Button Group
**Source:** `application-ui/elements/button-groups/basic.jsx`
**Location:** `src/components/application-ui/elements/button-group.tsx`

#### Usage
```tsx
import ButtonGroup from "@/components/application-ui/elements/button-group";
<ButtonGroup items={[{id:'a', label:'A'}]} value={val} onChange={setVal} />
```

### 35. Command Palette
**Source:** `application-ui/navigation/command-palettes/with_icons.jsx`
**Location:** `src/components/application-ui/navigation/command-palette.tsx`

#### Usage
```tsx
import CommandPalette from "@/components/application-ui/navigation/command-palette";
<CommandPalette open={isOpen} setOpen={setIsOpen} navigation={[]} />
```

### 36. Notification (Toast)
**Source:** `application-ui/overlays/notifications/simple.jsx`
**Location:** `src/components/application-ui/feedback/notification.tsx`

#### Usage
```tsx
import Notification from "@/components/application-ui/feedback/notification";
<Notification show={show} setShow={setShow} title="Saved!" type="success" />
```

### 37. Page Heading
**Source:** `application-ui/headings/page-headings/with_meta_and_actions.jsx`
**Location:** `src/components/application-ui/headings/page-heading.tsx`

#### Usage
```tsx
import PageHeading from "@/components/application-ui/headings/page-heading";
<PageHeading title="Dashboard" actions={[{label: 'New'}]} />
```

### 38. Sign-in Card
**Source:** `application-ui/forms/sign-in-forms/simple_card.jsx`
**Location:** `src/components/application-ui/forms/auth/sign-in-card.tsx`

#### Usage
```tsx
import SignInCard from "@/components/application-ui/forms/auth/sign-in-card";
<SignInCard onSubmit={handleLogin} onSocialLogin={handleSocial} />
```

### 39. Grid List
**Source:** `application-ui/lists/grid-lists/simple_cards.jsx`
**Location:** `src/components/application-ui/lists/grid-list.tsx`

#### Usage
```tsx
import GridList from "@/components/application-ui/lists/grid-list";
<GridList items={[{id:1, title:'Project A', initials:'PA', color:'bg-pink-600'}]} />
```

### 40. Feed
**Source:** `application-ui/lists/feeds/simple_with_icons.jsx`
**Location:** `src/components/application-ui/lists/feed.tsx`

#### Usage
```tsx
import Feed from "@/components/application-ui/lists/feed";
import { User } from "lucide-react";
<Feed items={[{id:1, content:'Joined', date:'1h', icon:User}]} />
```

### 41. Rich Select
**Source:** `application-ui/forms/select-menus/custom_with_avatar.jsx`
**Location:** `src/components/application-ui/forms/rich-select.tsx`

#### Usage
```tsx
import RichSelect from "@/components/application-ui/forms/rich-select";
<RichSelect options={[{id:1, name:'John', avatar:'/img.jpg', secondaryText:'@john'}]} />
```

### 42. Dropdown Menu
**Source:** `application-ui/elements/dropdowns/with_dividers.jsx`
**Location:** `src/components/application-ui/elements/dropdown-menu.tsx`

#### Usage
```tsx
import DropdownMenu from "@/components/application-ui/elements/dropdown-menu";
<DropdownMenu label="Options" sections={[{id:1, items:[{label:'Edit'}]}]} />
```

### 43. Filter Dropdown
**Source:** Custom / `application-ui/elements/dropdowns`
**Location:** `src/components/application-ui/elements/filter-dropdown.tsx`

#### Usage
```tsx
import FilterDropdown from "@/components/application-ui/elements/filter-dropdown";
<FilterDropdown label="Status" options={[{value:'active', label:'Active', checked:true}]} onChange={handleChange} />
```

## Next Steps
To migrate more components:
1.  Find the component in `TailwindPlus/components`.
2.  Run the standard migration prompt (defined in `DEV_NOTES.md`).
3.  Ensure `next.config.ts` allows any new external image domains.
