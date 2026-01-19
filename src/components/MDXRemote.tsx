import { MDXRemote as MDXRemoteBase } from 'next-mdx-remote/rsc'
import rehypeRaw from 'rehype-raw'

interface MDXRemoteProps {
  source: string
}

export function MDXRemote({ source }: MDXRemoteProps) {
  return (
    <MDXRemoteBase
      source={source}
      options={{
        mdxOptions: {
          format: 'md',
          rehypePlugins: [rehypeRaw],
        },
      }}
    />
  )
}
