"use client";

import { useMemo, useState } from "react";
import { EditIcon, FlagIcon, PlusIcon, TrashIcon, XIcon } from "@/components/icons";
import { createDisplayHomeSteps, detectedRoomLevels } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

type RoomItem = {
  id: string;
  name: string;
  details: string;
  floor: string;
  confidence: string;
  icon: (typeof detectedRoomLevels)[number]["rooms"][number]["icon"];
};

type ModalState =
  | { mode: "add" }
  | { mode: "edit"; roomId: string }
  | { mode: "review" }
  | { mode: "delete"; roomId: string };

const initialRooms: RoomItem[] = detectedRoomLevels.flatMap((level) =>
  level.rooms.map((room, index) => ({
    id: `${level.level.toLowerCase().replace(/\s+/g, "-")}-${index}`,
    name: room.name,
    details: room.details,
    floor: level.level,
    confidence: room.confidence,
    icon: room.icon,
  })),
);

export function RoomsStep() {
  const [rooms, setRooms] = useState<RoomItem[]>(initialRooms);
  const [reviewRoomName, setReviewRoomName] = useState("Unidentified space");
  const [reviewRoomNote, setReviewRoomNote] = useState("AI confidence low - please confirm or rename");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftDetails, setDraftDetails] = useState("");
  const [draftFloor, setDraftFloor] = useState("Ground floor");

  const currentRoom = modal && "roomId" in modal ? rooms.find((room) => room.id === modal.roomId) ?? null : null;
  const groupedRooms = useMemo(
    () =>
      detectedRoomLevels.map((level) => ({
        ...level,
        rooms: rooms.filter((room) => room.floor === level.level),
      })),
    [rooms],
  );

  const closeModal = () => {
    setModal(null);
    setDraftName("");
    setDraftDetails("");
    setDraftFloor("Ground floor");
  };

  const openAddModal = () => {
    setDraftName("");
    setDraftDetails("");
    setDraftFloor("Ground floor");
    setModal({ mode: "add" });
  };

  const openEditModal = (room: RoomItem) => {
    setDraftName(room.name);
    setDraftDetails(room.details);
    setDraftFloor(room.floor);
    setModal({ mode: "edit", roomId: room.id });
  };

  const openReviewModal = () => {
    setDraftName(reviewRoomName);
    setDraftDetails(reviewRoomNote);
    setDraftFloor("Ground floor");
    setModal({ mode: "review" });
  };

  const saveModal = () => {
    const nextName = draftName.trim();
    const nextDetails = draftDetails.trim();

    if (modal?.mode === "review") {
      if (nextName) setReviewRoomName(nextName);
      if (nextDetails) setReviewRoomNote(nextDetails);
      closeModal();
      return;
    }

    if (modal?.mode === "edit" && currentRoom) {
      setRooms((current) =>
        current.map((room) =>
          room.id === currentRoom.id
            ? {
                ...room,
                name: nextName || room.name,
                details: nextDetails || room.details,
                floor: draftFloor || room.floor,
              }
            : room,
        ),
      );
      closeModal();
      return;
    }

    if (modal?.mode === "add") {
      if (!nextName) return;

      setRooms((current) => [
        ...current,
        {
          id: `room-${Date.now()}`,
          name: nextName,
          details: nextDetails || "Add extracted details",
          floor: draftFloor,
          confidence: "New",
          icon: currentRoom?.icon ?? FlagIcon,
        },
      ]);
      closeModal();
    }
  };

  const deleteRoom = () => {
    if (!currentRoom) {
      closeModal();
      return;
    }

    setRooms((current) => current.filter((room) => room.id !== currentRoom.id));
    closeModal();
  };

  return (
    <>
      <StepShell step={createDisplayHomeSteps[3]}>
        <div className="create-home-floor-review">
          <div className="create-home-ai-callout create-home-floor-review-callout">
            <FlagIcon size={20} />
            <div>
              <strong>Floor-wise room review</strong>
              <p>The extracted floor plan is now split into Ground Floor and First Floor so you can confirm what lives on each level before moving on.</p>
            </div>
          </div>

          <div className="create-home-floor-review-summary">
            {groupedRooms.map((level) => (
              <article key={level.level}>
                <span>{level.level}</span>
                <strong>{level.rooms.length} rooms</strong>
                <small>{level.summary}</small>
              </article>
            ))}
          </div>

          <div className="create-home-floor-review-grid">
            {groupedRooms.map((level) => (
              <section className="create-home-floor-review-panel" key={level.level}>
                <header>
                  <div>
                    <span className="create-home-floor-plan-eyebrow">{level.level}</span>
                    <h3>{level.summary}</h3>
                    <p>{level.note}</p>
                  </div>
                </header>

                <div className="create-home-floor-review-list">
                  {level.rooms.map((room) => {
                    const Icon = room.icon;
                    return (
                      <article key={room.id}>
                        <span><Icon size={20} /></span>
                        <div>
                          <strong>{room.name} <small>{room.confidence}</small></strong>
                          <p>{room.details}</p>
                        </div>
                        <button aria-label={`Edit ${room.name}`} onClick={() => openEditModal(room)} type="button">
                          <EditIcon size={15} />
                        </button>
                        <button aria-label={`Delete ${room.name}`} className="danger" onClick={() => setModal({ mode: "delete", roomId: room.id })} type="button">
                          <TrashIcon size={15} />
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="create-home-review-room">
            <span><FlagIcon size={22} /></span>
            <div>
              <strong>{reviewRoomName} <small>Review</small></strong>
              <p>{reviewRoomNote}</p>
            </div>
            <button onClick={openReviewModal} type="button">
              <EditIcon size={14} />
              Name
            </button>
          </div>

          <button className="create-home-add-room" onClick={openAddModal} type="button">
            <PlusIcon size={15} />
            Add missing room manually
          </button>
        </div>
      </StepShell>

      {modal && modal.mode !== "delete" && (
        <div className="staff-modal-overlay" onClick={closeModal} role="presentation">
          <section
            aria-labelledby="rooms-modal-title"
            aria-modal="true"
            className="staff-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header>
              <span>{modal.mode === "review" ? <FlagIcon size={22} /> : <EditIcon size={22} />}</span>
              <div>
                <h2 id="rooms-modal-title">
                  {modal.mode === "add" ? "Add missing room" : modal.mode === "review" ? "Rename review room" : `Edit ${currentRoom?.name ?? "room"}`}
                </h2>
                <p>
                  {modal.mode === "add"
                    ? "Create a new room and place it on the correct floor."
                    : modal.mode === "review"
                      ? "Rename the room and update the review note."
                      : "Update the room name, floor or description."}
                </p>
              </div>
              <button aria-label="Close room modal" onClick={closeModal} type="button">
                <XIcon size={22} />
              </button>
            </header>

            <div className="staff-modal-form">
              <label>
                <span>Room name</span>
                <div>
                  <input
                    autoFocus
                    onChange={(event) => setDraftName(event.target.value)}
                    placeholder="Enter room name"
                    value={draftName}
                  />
                </div>
              </label>
              <label>
                <span>Floor</span>
                <div>
                  <select onChange={(event) => setDraftFloor(event.target.value)} value={draftFloor}>
                    <option>Ground floor</option>
                    <option>First floor</option>
                  </select>
                </div>
              </label>
              <label className="wide">
                <span>{modal.mode === "review" ? "Review note" : "Room details"}</span>
                <div>
                  <input
                    onChange={(event) => setDraftDetails(event.target.value)}
                    placeholder={modal.mode === "review" ? "Add review note" : "Room details"}
                    value={draftDetails}
                  />
                </div>
              </label>
            </div>

            <footer>
              <button onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="primary" onClick={saveModal} type="button">
                Save changes
              </button>
            </footer>
          </section>
        </div>
      )}

      {modal?.mode === "delete" && currentRoom && (
        <div className="staff-modal-overlay" onClick={closeModal} role="presentation">
          <section
            aria-labelledby="delete-room-title"
            aria-modal="true"
            className="staff-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header>
              <span><TrashIcon size={20} /></span>
              <div>
                <h2 id="delete-room-title">Delete room</h2>
                <p>Remove <strong>{currentRoom.name}</strong> from the detected room list.</p>
              </div>
              <button aria-label="Close delete dialog" onClick={closeModal} type="button">
                <XIcon size={22} />
              </button>
            </header>

            <div className="staff-modal-form">
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                This only removes the room from the current step. You can add it back manually anytime.
              </p>
            </div>

            <footer>
              <button onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="primary" onClick={deleteRoom} type="button">
                Delete room
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
