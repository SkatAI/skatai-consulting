import { MDXRemote as MDXRemoteBase } from 'next-mdx-remote/rsc'
import rehypeRaw from 'rehype-raw'
import './slides/TitleSlide.css'

function TitleSlide({ children }: { children: React.ReactNode }) {
  return <div className="title-slide">{children}</div>
}

interface MDXRemoteProps {
  source: string
}

export function MDXRemote({ source }: MDXRemoteProps) {
  return (
    <MDXRemoteBase
      source={source}
      components={{ TitleSlide }}
      options={{
        mdxOptions: {
          format: 'md',
          rehypePlugins: [rehypeRaw],
        },
      }}
    />
  )
}
