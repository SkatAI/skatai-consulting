import { MDXRemote as MDXRemoteBase } from 'next-mdx-remote/rsc'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import './slides/TitleSlide.css'

function TitleSlide({ children }: { children: React.ReactNode }) {
  return <div className="title-slide">{children}</div>
}

function Columns({ children }: { children: React.ReactNode }) {
  return <div className="columns">{children}</div>
}

function Column({ children }: { children: React.ReactNode }) {
  return <div className="column">{children}</div>
}

interface MDXRemoteProps {
  source: string
}

export function MDXRemote({ source }: MDXRemoteProps) {
  return (
    <MDXRemoteBase
      source={source}
      components={{ TitleSlide, Columns, Column }}
      options={{
        mdxOptions: {
          format: 'md',
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeRaw, rehypeKatex],
        },
      }}
    />
  )
}
