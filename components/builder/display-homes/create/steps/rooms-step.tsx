import { EditIcon, FlagIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { createDisplayHomeSteps, detectedRooms } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function RoomsStep() {
  return (
    <StepShell step={createDisplayHomeSteps[3]}>
      <div className="create-home-room-list">
        {detectedRooms.map((room) => {
          const Icon = room.icon;
          return (
            <article key={room.name}>
              <span><Icon size={21} /></span>
              <div><strong>{room.name} <small>AI</small></strong><p>Suggested: {room.products}</p></div>
              <button aria-label={`Edit ${room.name}`} type="button"><EditIcon size={15} /></button>
              <button aria-label={`Delete ${room.name}`} className="danger" type="button"><TrashIcon size={15} /></button>
            </article>
          );
        })}
      </div>
      <div className="create-home-review-room">
        <span><FlagIcon size={22} /></span>
        <div><strong>Unidentified space <small>Review</small></strong><p>AI confidence low - please confirm or rename</p></div>
        <button type="button"><EditIcon size={14} /> Name</button>
      </div>
      <button className="create-home-add-room" type="button"><PlusIcon size={15} /> Add missing room manually</button>
    </StepShell>
  );
}
