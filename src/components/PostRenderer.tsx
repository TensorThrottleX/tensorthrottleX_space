import Image from 'next/image';
import type { NotionBlock } from '@/types';

function RichText({ block }: { block: NotionBlock }) {
  const richText = block.richText ?? (block.plainText ? [{ plain_text: block.plainText }] : []);
  return (
    <span>
      {richText.map((t, i) => {
        let content: React.ReactNode = t.plain_text;
        const a = t.annotations;
        if (a?.bold) content = <strong key={i}>{content}</strong>;
        if (a?.italic) content = <em key={i}>{content}</em>;
        if (a?.strikethrough) content = <s key={i}>{content}</s>;
        if (a?.code) content = <code key={i} className="px-1 py-0.5 bg-neutral-100 rounded text-sm font-mono">{content}</code>;
        if (t.href) content = <a key={i} href={t.href} target="_blank" rel="noopener noreferrer" className="text-neutral-600 underline hover:text-neutral-900">{content}</a>;
        return <span key={i}>{content}</span>;
      })}
    </span>
  );
}

function Block({ block }: { block: NotionBlock }) {
  // console.log(`[DEBUG] Rendering block: ${block.type} (${block.id})`);
  const text = block.plainText ?? block.richText?.map((t) => t.plain_text).join('') ?? '';

  switch (block.type) {
    case 'paragraph':
      return text ? <p className="mb-4 text-neutral-700 leading-relaxed"><RichText block={block} /></p> : <p className="mb-4 h-4" />;
    case 'heading_1':
      return <h1 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4 first:mt-0"><RichText block={block} /></h1>;
    case 'heading_2':
      return <h2 className="text-xl font-semibold text-neutral-900 mt-6 mb-3"><RichText block={block} /></h2>;
    case 'heading_3':
      return <h3 className="text-lg font-medium text-neutral-900 mt-4 mb-2"><RichText block={block} /></h3>;
    case 'bulleted_list_item':
      return (
        <li className="ml-4 mb-1 list-disc text-neutral-700">
          <RichText block={block} />
          {block.children?.length ? <ul className="mt-1">{block.children.map((c) => <Block key={c.id} block={c} />)}</ul> : null}
        </li>
      );
    case 'numbered_list_item':
      return (
        <li className="ml-4 mb-1 list-decimal text-neutral-700">
          <RichText block={block} />
          {block.children?.length ? <ol className="mt-1">{block.children.map((c) => <Block key={c.id} block={c} />)}</ol> : null}
        </li>
      );
    case 'image':
      if (!block.url) return null;
      return (
        <figure className="my-6 mx-auto max-w-full">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-neutral-100">
            <Image src={block.url} alt={block.caption ?? ''} fill className="object-contain" sizes="(max-width: 768px) 100vw, 672px" />
          </div>
          {block.caption && <figcaption className="text-sm text-neutral-500 mt-2 text-center">{block.caption}</figcaption>}
        </figure>
      );
    case 'video':
      if (!block.url) return null;
      return (
        <figure className="my-6 mx-auto max-w-full">
          <video src={block.url} controls className="w-full max-w-full h-auto rounded-lg" />
          {block.caption && <figcaption className="text-sm text-neutral-500 mt-2">{block.caption}</figcaption>}
        </figure>
      );
    case 'embed':
    case 'bookmark':
      if (!block.url) return null;
      return (
        <div className="my-6">
          <a href={block.url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 underline hover:text-neutral-900 break-all">
            {block.url}
          </a>
        </div>
      );
    case 'divider':
      return <hr className="my-6 border-[var(--border)]" />;
    default:
      return text ? <p className="mb-4 text-neutral-700"><RichText block={block} /></p> : null;
  }
}

interface PostRendererProps {
  blocks: NotionBlock[];
}

export default function PostRenderer({ blocks }: PostRendererProps) {
  console.log(`[DEBUG] PostRenderer received ${blocks.length} blocks`);
  const listStack: { type: 'ul' | 'ol'; items: NotionBlock[] }[] = [];
  const nodes: React.ReactNode[] = [];
  let i = 0;

  for (const block of blocks) {
    if (block.type === 'bulleted_list_item') {
      if (listStack.length > 0 && listStack[listStack.length - 1].type === 'ul') {
        listStack[listStack.length - 1].items.push(block);
      } else {
        listStack.push({ type: 'ul', items: [block] });
      }
      continue;
    }
    if (block.type === 'numbered_list_item') {
      if (listStack.length > 0 && listStack[listStack.length - 1].type === 'ol') {
        listStack[listStack.length - 1].items.push(block);
      } else {
        listStack.push({ type: 'ol', items: [block] });
      }
      continue;
    }
    while (listStack.length > 0) {
      const { type, items } = listStack.pop()!;
      const List = type;
      nodes.push(<List key={`list-${i++}`} className="mb-4">{items.map((b) => <Block key={b.id} block={b} />)}</List>);
    }
    nodes.push(<Block key={block.id} block={block} />);
  }

  while (listStack.length > 0) {
    const { type, items } = listStack.pop()!;
    const List = type;
    nodes.push(<List key={`list-${i++}`} className="mb-4">{items.map((b) => <Block key={b.id} block={b} />)}</List>);
  }

  return <div className="post-body-inner">{nodes}</div>;
}
