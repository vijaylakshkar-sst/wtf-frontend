"use client";

import { useState } from "react";
import { EditIcon, FlagIcon, HomeIcon, PlusIcon, TrashIcon, XIcon } from "@/components/icons";
import { createDisplayHomeSteps, detectedRooms } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

type RoomItem = (typeof detectedRooms)[number] & {
  id: string;
};

type ModalState =
  | { mode: "add" }
  | { mode: "edit"; roomId: string }
  | { mode: "review" }
  | { mode: "delete"; roomId: string };

const initialRooms: RoomItem[] = detectedRooms.map((room, index) => ({
  ...room,
  id: `room-${index}`,
}));

export function RoomsStep() {
  const [rooms, setRooms] = useState<RoomItem[]>(initialRooms);
  const [reviewRoomName, setReviewRoomName] = useState("Unidentified space");
  const [reviewRoomNote, setReviewRoomNote] = useState("AI confidence low - please confirm or rename");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftProducts, setDraftProducts] = useState("");

  const currentRoom = modal && "roomId" in modal ? rooms.find((room) => room.id === modal.roomId) ?? null : null;

  const closeModal = () => {
    setModal(null);
    setDraftName("");
    setDraftProducts("");
  };

  const openAddModal = () => {
    setDraftName("");
    setDraftProducts("");
    setModal({ mode: "add" });
  };

  const openEditModal = (room: RoomItem) => {
    setDraftName(room.name);
    setDraftProducts(room.products);
    setModal({ mode: "edit", roomId: room.id });
  };

  const openReviewModal = () => {
    setDraftName(reviewRoomName);
    setDraftProducts(reviewRoomNote);
    setModal({ mode: "review" });
  };

  const saveModal = () => {
    const nextName = draftName.trim();
    const nextProducts = draftProducts.trim();

    if (modal?.mode === "review") {
      if (nextName) {
        setReviewRoomName(nextName);
      }
      if (nextProducts) {
        setReviewRoomNote(nextProducts);
      }
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
                products: nextProducts || room.products,
              }
            : room,
        ),
      );
      closeModal();
      return;
    }

    if (modal?.mode === "add") {
      if (!nextName) {
        return;
      }

      setRooms((current) => [
        ...current,
        {
          id: `room-${Date.now()}`,
          name: nextName,
          products: nextProducts || "Add suggested products",
          icon: HomeIcon,
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
        <div className="create-home-room-list">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <article key={room.id}>
                <span><Icon size={21} /></span>
                <div>
                  <strong>{room.name} <small>AI</small></strong>
                  <p>Suggested: {room.products}</p>
                </div>
                <button aria-label={`Edit ${room.name}`} onClick={() => openEditModal(room)} type="button">
                  <EditIcon size={15} />
                </button>
                <button
                  aria-label={`Delete ${room.name}`}
                  className="danger"
                  onClick={() => setModal({ mode: "delete", roomId: room.id })}
                  type="button"
                >
                  <TrashIcon size={15} />
                </button>
              </article>
            );
          })}
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
                    ? "Create a new room and add the suggested products."
                    : modal.mode === "review"
                      ? "Rename the room and update the review note."
                      : "Update the room name or suggested products."}
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
              <label className="wide">
                <span>{modal.mode === "review" ? "Review note" : "Suggested products"}</span>
                <div>
                  <input
                    onChange={(event) => setDraftProducts(event.target.value)}
                    placeholder={modal.mode === "review" ? "Add review note" : "Suggested products"}
                    value={draftProducts}
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
