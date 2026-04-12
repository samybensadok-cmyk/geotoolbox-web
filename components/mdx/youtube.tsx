type YouTubeProps = {
  id: string
  title?: string
}

export function YouTube({ id, title = "Video" }: YouTubeProps) {
  return (
    <div className="my-6 aspect-video overflow-hidden rounded-xl not-prose">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
        loading="lazy"
      />
    </div>
  )
}
