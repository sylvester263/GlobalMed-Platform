"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  ClipboardCheck,
  FileText,
  GripVertical,
  Pencil,
  PlayCircle,
  Plus,
  Radio,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  addLesson,
  addModule,
  deleteModule,
  renameModule,
  reorderLessons,
  reorderModules,
} from "@/lib/lms/builder-actions";
import { cn } from "@/lib/utils";

import { useBuilderAction } from "./use-builder-action";

type Lesson = {
  id: string;
  title: string;
  type: "video" | "text" | "pdf" | "quiz" | "assignment" | "live";
  is_preview: boolean;
  video_status: string;
};
type Module = { id: string; title: string; lessons: Lesson[] };

const typeMeta = {
  video: { icon: PlayCircle, label: "Video" },
  text: { icon: FileText, label: "Text" },
  pdf: { icon: FileText, label: "PDF" },
  quiz: { icon: ClipboardCheck, label: "Quiz" },
  assignment: { icon: FileText, label: "Assignment" },
  live: { icon: Radio, label: "Live session" },
} as const;

const videoBadge: Record<
  string,
  { label: string; variant: "neutral" | "warning" | "success" | "destructive" }
> = {
  none: { label: "No video yet", variant: "neutral" },
  uploading: { label: "Uploading", variant: "warning" },
  processing: { label: "Processing", variant: "warning" },
  ready: { label: "Video ready", variant: "success" },
  failed: { label: "Video failed", variant: "destructive" },
};

function useSortableRow(id: string) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return {
    ref: setNodeRef,
    handleRef: setActivatorNodeRef,
    handleProps: { ...attributes, ...listeners },
    style: { transform: CSS.Transform.toString(transform), transition },
    isDragging,
  };
}

function MoveButtons({
  index,
  count,
  onMove,
  label,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  label: string;
}) {
  return (
    <span className="flex">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
      >
        <ArrowUp aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Move ${label} down`}
        disabled={index === count - 1}
        onClick={() => onMove(index + 1)}
      >
        <ArrowDown aria-hidden="true" />
      </Button>
    </span>
  );
}

function LessonRow({
  lesson,
  index,
  count,
  courseId,
  onMove,
}: {
  lesson: Lesson;
  index: number;
  count: number;
  courseId: string;
  onMove: (to: number) => void;
}) {
  const row = useSortableRow(lesson.id);
  const meta = typeMeta[lesson.type];
  const Icon = meta.icon;
  const badge = lesson.type === "video" ? videoBadge[lesson.video_status] : undefined;
  return (
    <li
      ref={row.ref}
      style={row.style}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-card px-2 py-2",
        row.isDragging && "z-10 shadow-lg",
      )}
    >
      <button
        type="button"
        ref={row.handleRef}
        {...row.handleProps}
        aria-label={`Drag to reorder ${lesson.title}`}
        className="flex size-9 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-ledger active:cursor-grabbing"
      >
        <GripVertical aria-hidden="true" className="size-4" />
      </button>
      <Icon aria-hidden="true" className="size-4 shrink-0 text-teal" />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold break-words">{lesson.title}</span>
        <span className="text-xs text-muted-foreground">{meta.label}</span>
      </span>
      <span className="hidden flex-wrap gap-1 sm:flex">
        {lesson.is_preview && <Badge variant="secondary">Free preview</Badge>}
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      </span>
      <MoveButtons index={index} count={count} onMove={onMove} label={lesson.title} />
      <Link
        href={`/dashboard/instructor/courses/${courseId}/lessons/${lesson.id}`}
        aria-label={`Edit ${lesson.title}`}
        className="flex size-9 items-center justify-center rounded-md hover:bg-mint"
      >
        <Pencil aria-hidden="true" className="size-4" />
      </Link>
    </li>
  );
}

function ModuleCard({
  module,
  index,
  count,
  courseId,
  onMoveModule,
}: {
  module: Module;
  index: number;
  count: number;
  courseId: string;
  onMoveModule: (to: number) => void;
}) {
  const row = useSortableRow(module.id);
  const [lessons, setLessons] = useState(module.lessons);
  const [editing, setEditing] = useState(false);
  const { pending, run } = useBuilderAction();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => setLessons(module.lessons), [module.lessons]);

  function moveLesson(from: number, to: number) {
    const next = arrayMove(lessons, from, to);
    setLessons(next);
    run(() => reorderLessons({ parentId: module.id, orderedIds: next.map((l) => l.id) }));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    moveLesson(
      lessons.findIndex((l) => l.id === active.id),
      lessons.findIndex((l) => l.id === over.id),
    );
  }

  return (
    <li
      ref={row.ref}
      style={row.style}
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-ledger p-3 sm:p-4",
        row.isDragging && "z-10 shadow-lg",
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          ref={row.handleRef}
          {...row.handleProps}
          aria-label={`Drag to reorder module ${module.title}`}
          className="flex size-9 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-card"
        >
          <GripVertical aria-hidden="true" className="size-4" />
        </button>
        {editing ? (
          <form
            action={(form) =>
              run(
                () => renameModule(module.id, String(form.get("title") ?? "")),
                () => setEditing(false),
              )
            }
            className="flex flex-1 gap-2"
          >
            <label htmlFor={`rename-${module.id}`} className="sr-only">
              Module title
            </label>
            <Input
              id={`rename-${module.id}`}
              name="title"
              defaultValue={module.title}
              autoFocus
              className="h-9"
            />
            <Button type="submit" size="sm" loading={pending}>
              Save
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <h3 className="flex-1 font-serif text-lg font-semibold">
            Module {index + 1} · {module.title}
          </h3>
        )}
        {!editing && (
          <>
            <MoveButtons
              index={index}
              count={count}
              onMove={onMoveModule}
              label={`module ${module.title}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Rename module ${module.title}`}
              onClick={() => setEditing(true)}
            >
              <Pencil aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete module ${module.title}`}
              disabled={lessons.length > 0}
              title={lessons.length > 0 ? "Move or delete its lessons first" : undefined}
              onClick={() => run(() => deleteModule(module.id))}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <ol className="flex flex-col gap-2">
            {lessons.map((lesson, i) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={i}
                count={lessons.length}
                courseId={courseId}
                onMove={(to) => moveLesson(i, to)}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      {lessons.length === 0 && (
        <p className="text-sm text-muted-foreground">No lessons in this module yet.</p>
      )}

      <form
        action={(form) =>
          run(() =>
            addLesson(
              module.id,
              String(form.get("title") ?? ""),
              String(form.get("type") ?? "video"),
            ),
          )
        }
        className="flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor={`new-lesson-${module.id}`} className="sr-only">
          New lesson title
        </label>
        <Input
          id={`new-lesson-${module.id}`}
          name="title"
          placeholder="New lesson title"
          required
          minLength={2}
          className="sm:flex-1"
        />
        <label htmlFor={`new-lesson-type-${module.id}`} className="sr-only">
          Lesson type
        </label>
        <NativeSelect
          id={`new-lesson-type-${module.id}`}
          name="type"
          defaultValue="video"
          className="sm:w-40"
        >
          {Object.entries(typeMeta).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </NativeSelect>
        <Button type="submit" variant="secondary" loading={pending}>
          <Plus aria-hidden="true" /> Add lesson
        </Button>
      </form>
    </li>
  );
}

/** P4-1: modules and lessons with drag-and-drop (plus keyboard and button) reordering. */
export function CurriculumEditor({
  courseId,
  modules: initial,
}: {
  courseId: string;
  modules: Module[];
}) {
  const [modules, setModules] = useState(initial);
  const { pending, run } = useBuilderAction();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => setModules(initial), [initial]);

  function moveModule(from: number, to: number) {
    const next = arrayMove(modules, from, to);
    setModules(next);
    run(() => reorderModules({ parentId: courseId, orderedIds: next.map((m) => m.id) }));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    moveModule(
      modules.findIndex((m) => m.id === active.id),
      modules.findIndex((m) => m.id === over.id),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <ol className="flex flex-col gap-4">
            {modules.map((module, i) => (
              <ModuleCard
                key={module.id}
                module={module}
                index={i}
                count={modules.length}
                courseId={courseId}
                onMoveModule={(to) => moveModule(i, to)}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      {modules.length === 0 && (
        <p className="text-muted-foreground">Start with a module, then add lessons to it.</p>
      )}
      <form
        action={(form) => run(() => addModule(courseId, String(form.get("title") ?? "")))}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="new-module" className="sr-only">
          New module title
        </label>
        <Input
          id="new-module"
          name="title"
          placeholder="New module title"
          required
          minLength={2}
          className="sm:flex-1"
        />
        <Button type="submit" loading={pending}>
          <Plus aria-hidden="true" /> Add module
        </Button>
      </form>
    </div>
  );
}
